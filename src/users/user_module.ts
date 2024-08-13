import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './user_service';
import { UsuarioController } from './user_controller';
import { Usuario } from 'src/entities/user_entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
    exports: [TypeOrmModule.forFeature([Usuario])] // Exportar o repositório

})
export class UsuarioModule {}
