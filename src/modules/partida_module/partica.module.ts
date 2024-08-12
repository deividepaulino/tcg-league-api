import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from 'src/entities/partida_entity';
import { PartidaService } from './partida.service';
import { PartidaController } from './partida.controller';
import { Usuario } from 'src/entities/user_entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partida, Usuario])],
  providers: [PartidaService],
  controllers: [PartidaController],
})
export class PartidaModule {}
