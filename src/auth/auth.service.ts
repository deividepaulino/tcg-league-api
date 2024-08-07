import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/user_entity';
import { Token } from '../entities/token_entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<any> {
    this.logger.log(`Validating user with email: ${email}`);
    const usuario = await this.usuarioRepository.findOneBy({ email });

    if (!usuario) {
      this.logger.warn(`User not found with email: ${email}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
    if (usuario && isPasswordValid) {
      const { senha, ...result } = usuario;
      this.logger.log(`User validated: ${JSON.stringify(result)}`);
      return result;
    } else {
      this.logger.warn(`Invalid password for user with email: ${email}`);
    }

    return null;
  }

  async login(email: string, senha: string): Promise<any> {
    const user = await this.validateUser(email, senha);

    if (!user) {
      this.logger.warn('Usuário ou senha inválidos');
      return { message: 'Usuário ou senha inválidos' };
    }

    if (!user.ativo) {
      this.logger.warn('Usuário inativo');
      return { message: 'Usuário inativo' };
    }

    if (!user.emailConfirmado) {
      this.logger.warn('E-mail não confirmado');
      return { message: 'E-mail não confirmado' };
    }

    // Remover tokens ativos para o usuário
    await this.invalidateUserTokens(user.id);

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    const tokenEntity = new Token();
    tokenEntity.usuario_id = user.id;
    tokenEntity.token = token;
    await this.tokenRepository.save(tokenEntity);

    this.logger.log(`User logged in: ${JSON.stringify(payload)}`);
    return {
      access_token: token,
    };
  }

  private async invalidateUserTokens(userId: number): Promise<void> {
    const tokens = await this.tokenRepository.find({ where: { usuario_id: userId } });
    if (tokens.length > 0) {
      this.logger.log(`Invalidating ${tokens.length} tokens for user id: ${userId}`);
      await this.tokenRepository.remove(tokens);
    }
  }
}
