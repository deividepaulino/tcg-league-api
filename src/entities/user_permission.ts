import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Usuario } from './user_entity';
import { Permissao } from './permission_entity';

@Entity('usuarios_permissoes')
export class UsuarioPermissao {
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => Permissao, permissao => permissao.usuariosPermissoes)
  permissao: Permissao;
}
