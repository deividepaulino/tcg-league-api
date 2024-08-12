import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from '../entities/user_entity';
import { Token } from '../entities/token_entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../core/jwt/jwt_strategy'; // Ajuste o caminho se necessário

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Token]),
    PassportModule,
    JwtModule.register({
      secret: 'D31v1d3123',
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, AuthService], // Certifique-se de exportar JwtModule
})
export class AuthModule {}
