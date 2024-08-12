import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/entities/user_entity";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm/repository/Repository";

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    this.logger.log('Fetching all users');
    try {
      const users = await this.usuarioRepository.find();
      this.logger.log(`Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack);
      throw new Error('Failed to fetch users');
    }
  }

  async findOne(id: number): Promise<Usuario> {
    this.logger.log(`Fetching user with id ${id}`);
    try {
      const user = await this.usuarioRepository.findOneBy({ id });
      if (user) {
        this.logger.log(`Found user: ${JSON.stringify(user)}`);
      } else {
        this.logger.warn(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user with id ${id}`, error.stack);
      throw new Error(`Failed to fetch user with id ${id}`);
    }
  }

  async create(usuario: Usuario): Promise<Usuario> {
    this.logger.log(`Creating user: ${JSON.stringify(usuario)}`);
    try {
      usuario.senha = await bcrypt.hash(usuario.senha, 10);
      const newUser = await this.usuarioRepository.save(usuario);
      this.logger.log(`Created user: ${JSON.stringify(newUser)}`);
      return newUser;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw new Error('Failed to create user');
    }
  }

  async update(id: number, usuario: Usuario): Promise<Usuario> {
    this.logger.log(`Updating user with id ${id}`);
    try {
      await this.usuarioRepository.update(id, usuario);
      const updatedUser = await this.findOne(id);
      this.logger.log(`Updated user: ${JSON.stringify(updatedUser)}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user with id ${id}`, error.stack);
      throw new Error(`Failed to update user with id ${id}`);
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing user with id ${id}`);
    try {
      await this.usuarioRepository.delete(id);
      this.logger.log(`User with id ${id} removed`);
    } catch (error) {
      this.logger.error(`Failed to remove user with id ${id}`, error.stack);
      throw new Error(`Failed to remove user with id ${id}`);
    }
  }
}
