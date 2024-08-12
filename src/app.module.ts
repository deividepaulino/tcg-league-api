import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user_entity';
import { Permissao } from './entities/permission_entity';
import { Token } from './entities/token_entity';
import { UsuarioPermissao } from './entities/user_permission';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './users/user_module';
import { CustomAuthGuard } from './core/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/tcg.db',
      entities: [Usuario, Permissao, Token, UsuarioPermissao],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([Usuario, Permissao, Token, UsuarioPermissao]),
    AuthModule, // Importa o AuthModule para usar o JwtService
    UsuarioModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: CustomAuthGuard,
    },
  ],
})
export class AppModule {}
