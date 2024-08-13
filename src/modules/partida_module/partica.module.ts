import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from 'src/entities/partida_entity';
import { PartidaService } from './partida.service';
import { PartidaController } from './partida.controller';
import { Usuario } from 'src/entities/user_entity';
import { UsuarioService } from 'src/users/user_service';
import { TorneioModule } from '../torneio_module/torneio.module';
import { UsuarioModule } from 'src/users/user_module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partida, Usuario]), 
    TorneioModule, 
    UsuarioModule
  ],
  providers: [PartidaService, UsuarioService],
  controllers: [PartidaController],
})
export class PartidaModule {}
