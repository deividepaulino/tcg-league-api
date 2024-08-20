import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partida } from 'src/entities/partida_entity';
import { Usuario } from 'src/entities/user_entity';
import { Repository } from 'typeorm';
import { TorneioService } from '../torneio_module/torneio.service';

@Injectable()
export class PartidaService {
  constructor(
    @InjectRepository(Partida)
    private readonly partidaRepository: Repository<Partida>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly torneioService: TorneioService,
  ) {}

  findAll() {
    return this.partidaRepository.find();
  }

  findOne(id: number) {
    return this.partidaRepository.findOneBy({ id });
  }

  async findByPlayerId(playerId: number) {
    return this.partidaRepository.createQueryBuilder('partida')
      .leftJoinAndSelect('partida.jogador1', 'jogador1')
      .leftJoinAndSelect('partida.jogador2', 'jogador2')
      .where('partida.jogador1.id = :playerId OR partida.jogador2.id = :playerId', { playerId })
      .getMany();
  }

  async create(jogador1Id: number, jogador2Id: number, torneioId: number) {
    const participantes = await this.torneioService.findParticipantes(torneioId);
    
    const jogador1 = participantes.find(p => p.id === jogador1Id);
    const jogador2 = participantes.find(p => p.id === jogador2Id);

    if (!jogador1 || !jogador2) {
      throw new NotFoundException('Um ou ambos os jogadores não foram encontrados no torneio.');
    }

    const partida = this.partidaRepository.create({
      jogador1: { id: jogador1.id } as Usuario,
      jogador2: { id: jogador2.id } as Usuario,
    });
    return this.partidaRepository.save(partida);
  }

async update(id: number, placarJogador1: number, placarJogador2: number) {
  const partida = await this.partidaRepository.findOne({
    where: { id },
    relations: ['jogador1', 'jogador2', 'torneio'],
  });

  if (!partida) {
    throw new NotFoundException('Partida não encontrada.');
  }

  // Atualiza os placares da partida
  await this.partidaRepository.update(id, {
    placar_jogador1: placarJogador1,
    placar_jogador2: placarJogador2,
  });

  // Incrementa o número de partidas jogadas na classificação dos jogadores
  const classificacaoJogador1 = await this.torneioService.incrementarPartidasJogadas(partida.torneio.id, partida.jogador1.id);
  const classificacaoJogador2 = await this.torneioService.incrementarPartidasJogadas(partida.torneio.id, partida.jogador2.id);

  return {
    mensagem: 'Partida atualizada e número de partidas jogadas incrementado para os jogadores.',
    classificacaoJogador1,
    classificacaoJogador2,
  };
}


  finish(id: number) {
    return this.partidaRepository.update(id, { status: 'finalizado' });
  }

  remove(id: number) {
    return this.partidaRepository.delete(id);
  }
}
