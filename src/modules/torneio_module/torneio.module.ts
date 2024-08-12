import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorneioService } from './torneio.service';
import { TorneioController } from './torneio.controller';
import { Torneio } from 'src/entities/torneio/torneio_entity';
import { Participante } from 'src/entities/torneio/participante_entity';
import { Classificacao } from 'src/entities/torneio/classificacao_entity';

@Module({
  imports: [TypeOrmModule.forFeature([Torneio, Participante, Classificacao])],
  providers: [TorneioService],
  controllers: [TorneioController],
})
export class TorneioModule {}
