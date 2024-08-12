import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoricoPartida } from 'src/entities/historico_partidas_entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoricoPartidaService {
  constructor(
    @InjectRepository(HistoricoPartida)
    private readonly historicoPartidaRepository: Repository<HistoricoPartida>,
  ) {}

  findAll() {
    return this.historicoPartidaRepository.find();
  }

  findOne(id: number) {
    return this.historicoPartidaRepository.findOneBy({ id });
  }

  findByUsuario(usuarioId: number) {

        return this.historicoPartidaRepository.find({
      where: [
        { jogador1: { id: usuarioId } },
        { jogador2: { id: usuarioId } }
      ],
      relations: ['jogador1', 'jogador2', 'deck1', 'deck2', 'torneio'] 
      
    });



  
  }
}
