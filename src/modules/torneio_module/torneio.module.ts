// torneio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorneioService } from './torneio.service';
import { TorneioController } from './torneio.controller';
import { Torneio } from 'src/entities/torneio/torneio_entity';
import { Participante } from 'src/entities/torneio/participante_entity';
import { Classificacao } from 'src/entities/torneio/classificacao_entity';
import { UsuarioModule } from 'src/users/user_module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Torneio, Participante, Classificacao]),
    UsuarioModule, // Importar o módulo que fornece UsuarioRepository
  ],
  providers: [TorneioService],
  controllers: [TorneioController],
})
export class TorneioModule {}
