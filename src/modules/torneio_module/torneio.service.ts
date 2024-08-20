import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Classificacao } from 'src/entities/torneio/classificacao_entity';
import { Participante } from 'src/entities/torneio/participante_entity';
import { Torneio } from 'src/entities/torneio/torneio_entity';
import { Usuario } from 'src/entities/user_entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TorneioService {
  constructor(
    @InjectRepository(Torneio)
    private readonly torneioRepository: Repository<Torneio>,
    @InjectRepository(Participante)
    private readonly participanteRepository: Repository<Participante>,
    @InjectRepository(Classificacao)
    private readonly classificacaoRepository: Repository<Classificacao>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  private generateUniqueCode(length: number = 8): string {
    return randomBytes(length).toString('hex').slice(0, length).toUpperCase();
  }

  async create(nome: string, dataAbertura: Date, dataEncerramento?: Date): Promise<Torneio> {
    const codigo = this.generateUniqueCode();

    const torneio = this.torneioRepository.create({
      nome,
      data_abertura: dataAbertura,
      data_encerramento: dataEncerramento,
      codigo,
    });

    return this.torneioRepository.save(torneio);
  }

  async findOne(id: number): Promise<Torneio> {
    const torneio = await this.torneioRepository.findOne({
      where: { id },
      relations: ['participantes', 'classificacoes'],
    });
    if (!torneio) {
      throw new NotFoundException(`Torneio com id ${id} não encontrado`);
    }
    return torneio;
  }

  async findAll(): Promise<Torneio[]> {
    return this.torneioRepository.find();
  }

  async findByUserId(userId: number) {
    const torneios = await this.participanteRepository
      .createQueryBuilder('participante')
      .leftJoinAndSelect('participante.torneio', 'torneio')
      .where('participante.usuario.id = :userId', { userId }) // Atualizado para usar a relação correta
      .getMany();

    const uniqueTorneios = torneios.map(participante => participante.torneio);
    return uniqueTorneios;
  }

  async ingressarNoTorneio(codigoAcesso: string, usuarioId: number): Promise<Participante> {
    const torneio = await this.torneioRepository.findOne({
      where: { codigo: codigoAcesso },
    });

    if (!torneio) {
      throw new NotFoundException('Torneio não encontrado.');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const participanteExistente = await this.participanteRepository.findOne({
      where: { torneio, usuario },
    });

    if (participanteExistente) {
      throw new ConflictException('Usuário já está inscrito neste torneio.');
    }

    const novoParticipante = this.participanteRepository.create({
      usuario,
      torneio,
    });

    return this.participanteRepository.save(novoParticipante);
  }

  async findParticipantes(id: number): Promise<{ id: number, nome: string, deck: { id: number, nome: string } }[]> {
    const torneio = await this.torneioRepository.findOne({
      where: { id },
      relations: ['participantes', 'participantes.deck', 'participantes.usuario'],
    });

    if (!torneio) {
      throw new NotFoundException(`Torneio com id ${id} não encontrado`);
    }

    return torneio.participantes.map(participante => ({
      id: participante.id,
      nome: participante.usuario.nome,
      deck: participante.deck ? { id: participante.deck.id, nome: participante.deck.deck_name } : null,
    }));
  }

  async soltarRodada(torneioId: number): Promise<void> {
    const torneio = await this.torneioRepository.findOne({
      where: { id: torneioId },
      relations: ['participantes', 'classificacoes'],
    });

    if (!torneio) {
      throw new NotFoundException(`Torneio com id ${torneioId} não encontrado`);
    }

    const participantes = torneio.participantes;

    if (participantes.length < 2) {
      throw new ConflictException('Número insuficiente de participantes para soltar uma rodada.');
    }

    const classificacoes = await this.classificacaoRepository.find({
      where: { torneio },
      order: { pontuacao: 'DESC', vitorias: 'DESC' },
    });

    const partidas = [];
    const participantesEmparelhados = new Set<number>();

    for (const classificacao of classificacoes) {
      const participante = classificacao.usuario;

      if (!participantesEmparelhados.has(participante.id)) {
        const oponente = classificacoes.find(c => !participantesEmparelhados.has(c.usuario.id));

        if (oponente) {
          participantesEmparelhados.add(participante.id);
          participantesEmparelhados.add(oponente.usuario.id);

          partidas.push({
            jogador1: participante,
            jogador2: oponente.usuario,
            placar_jogador1: 0,
            placar_jogador2: 0,
            status: 'em andamento',
            torneio: torneio,
          });
        }
      }
    }

    await this.classificacaoRepository.save(partidas);
  }

  async getDetalhesPorUsuario(userId: number) {
    const torneios = await this.findByUserId(userId);

    const resultados = await Promise.all(
      torneios.map(async torneio => {
        const participantes = await this.participanteRepository.find({
          where: { torneio },
          relations: ['usuario', 'deck'],
        });

        const participanteAtual = participantes.find(participante => participante.usuario.id === userId);
        const posicaoAtual = participanteAtual ? participantes.indexOf(participanteAtual) + 1 : null;
        const deckAtual = participanteAtual ? participanteAtual.deck : null;

        return {
          torneioId: torneio.id,
          torneioNome: torneio.nome,
          posicaoAtual,
          deckAtual: deckAtual ? { id: deckAtual.id, nome: deckAtual.deck_name } : null,
          quantidadeParticipantes: participantes.length,
          dataInicio: torneio.data_abertura,
          status: torneio.status,
        };
      }),
    );

    return resultados;
  }

   // Método para buscar a tabela do torneio do qual o usuário está participando
  async getTabelaUsuario(userId: number, torneioId: number) {
    const torneio = await this.torneioRepository.findOne({
      where: { id: torneioId },
      relations: ['classificacoes', 'classificacoes.usuario', 'classificacoes.deck'],
    });

    if (!torneio) {
      throw new NotFoundException(`Torneio com id ${torneioId} não encontrado`);
    }

    const classificacoes = torneio.classificacoes;

    const tabela = classificacoes.map(classificacao => ({
      posicao: classificacao.posicao,
      nome: classificacao.usuario.nome,
      deck: classificacao.deck ? { id: classificacao.deck.id, nome: classificacao.deck.deck_name } : null,
      vitorias: classificacao.vitorias,
      derrotas: classificacao.partidasJogadas - classificacao.vitorias, 
      pontuacao: classificacao.pontuacao,
      empates: classificacao.empates,
    }));

    return tabela;
  }

  async incrementarPartidasJogadas(torneioId: number, usuarioId: number) {
  const classificacao = await this.classificacaoRepository.findOne({
    where: { torneio: { id: torneioId }, usuario: { id: usuarioId } },
  });

  if (!classificacao) {
    throw new NotFoundException('Classificação não encontrada.');
  }

  classificacao.partidasJogadas += 1;
  return this.classificacaoRepository.save(classificacao);
}

}
