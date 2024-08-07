import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user_entity';
import { Permissao } from './entities/permission_entity';
import { Token } from './entities/token_entity';
import { UsuarioPermissao } from './entities/user_permission';
import { UsuarioController } from './users/user_controller';
import { UsuarioService } from './users/user_service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/tcg.db',
      entities: [Usuario, Permissao, Token, UsuarioPermissao],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([Usuario, Permissao, Token, UsuarioPermissao]),
    AuthModule,
    // Outros módulos
  ],
  controllers: [UsuarioController], // Registrar o controlador
  providers: [UsuarioService], // Registrar o serviço
})
export class AppModule {}
