import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CustomAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Permitir POST para criar usuários e login sem autenticação
    if (method === 'POST' && (url === '/usuarios' || url === '/auth/login')) {
      return true;
    }

    // Verificar o token JWT para as outras rotas
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Token não encontrado no cabeçalho da requisição.');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      request['user'] = decoded; // Anexar os dados do usuário decodificados ao request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
