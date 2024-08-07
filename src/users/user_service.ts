import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/entities/user_entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    this.logger.log('Fetching all users');
    const users = await this.usuarioRepository.find();
    this.logger.log(`Found ${users.length} users`);
    return users;
  }

  async findOne(id: number): Promise<Usuario> {
    this.logger.log(`Fetching user with id ${id}`);
    const user = await this.usuarioRepository.findOneBy({ id });
    if (user) {
      this.logger.log(`Found user: ${JSON.stringify(user)}`);
    } else {
      this.logger.warn(`User with id ${id} not found`);
    }
    return user;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    this.logger.log(`Creating user: ${JSON.stringify(usuario)}`);
    
    // Ensure password is hashed
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
    
    const newUser = await this.usuarioRepository.save(usuario);
    this.logger.log(`Created user: ${JSON.stringify(newUser)}`);
    return newUser;
  }

  async update(id: number, usuario: Usuario): Promise<Usuario> {
    this.logger.log(`Updating user with id ${id}`);
    await this.usuarioRepository.update(id, usuario);
    const updatedUser = await this.findOne(id);
    this.logger.log(`Updated user: ${JSON.stringify(updatedUser)}`);
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing user with id ${id}`);
    await this.usuarioRepository.delete(id);
    this.logger.log(`User with id ${id} removed`);
  }
}
