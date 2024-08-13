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
      codigo, // Adicione o código gerado
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
    // Busca os torneios onde o usuário está participando
    const torneios = await this.participanteRepository
      .createQueryBuilder('participante')
      .leftJoinAndSelect('participante.torneio', 'torneio')
      .where('participante.usuarioId = :userId', { userId })
      .getMany();

    // Extrai a lista de torneios únicos
    const uniqueTorneios = torneios.map(participante => participante.torneio);
    return uniqueTorneios;
  }

async ingressarNoTorneio(codigoAcesso: string, usuarioId: number): Promise<Participante> {
  const torneio = await this.torneioRepository.findOne({
    where: { codigo: codigoAcesso }, // Condição para encontrar o torneio
  });

  if (!torneio) {
    throw new NotFoundException('Torneio não encontrado.');
  }

  const usuario = await this.usuarioRepository.findOne({
    where: { id: usuarioId }, // Condição para encontrar o usuário
  });

  if (!usuario) {
    throw new NotFoundException('Usuário não encontrado.');
  }

  const participanteExistente = await this.participanteRepository.findOne({
    where: { torneio, usuario }, // Condições para verificar a existência
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
      relations: ['participantes', 'participantes.deck', 'participantes.usuario'], // Incluindo participantes, deck e usuário
    });

    if (!torneio) {
      throw new NotFoundException(`Torneio com id ${id} não encontrado`);
    }

    return torneio.participantes.map(participante => ({
      id: participante.id,
      nome: participante.usuario.nome, // Presumindo que `nome` está em Usuario
      deck: participante.deck ? { id: participante.deck.id, nome: participante.deck.deck_name } : null, // Incluindo informações do deck, se disponível
    }));
  }

}
