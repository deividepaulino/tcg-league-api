import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partida } from 'src/entities/partida_entity';
import { Usuario } from 'src/entities/user_entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartidaService {
  constructor(
    @InjectRepository(Partida)
    private readonly partidaRepository: Repository<Partida>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
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

  create(jogador1Id: number, jogador2Id: number) {
    const partida = this.partidaRepository.create({
      jogador1: { id: jogador1Id } as Usuario,
      jogador2: { id: jogador2Id } as Usuario,
    });
    return this.partidaRepository.save(partida);
  }

  update(id: number, placarJogador1: number, placarJogador2: number) {
    return this.partidaRepository.update(id, { placar_jogador1: placarJogador1, placar_jogador2: placarJogador2 });
  }

  finish(id: number) {
    return this.partidaRepository.update(id, { status: 'finalizado' });
  }

  remove(id: number) {
    return this.partidaRepository.delete(id);
  }
}
