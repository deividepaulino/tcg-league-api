import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricoPartida } from 'src/entities/historico_partidas_entity';
import { HistoricoPartidaService } from './historico..service';
import { HistoricoPartidaController } from './historico..controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricoPartida])],
  providers: [HistoricoPartidaService],
  controllers: [HistoricoPartidaController],
})
export class HistoricoPartidaModule {}
