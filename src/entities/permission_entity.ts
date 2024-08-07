import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UsuarioPermissao } from './user_permission';

@Entity('permissoes')
export class Permissao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  acao: string;

  @OneToMany(() => UsuarioPermissao, usuarioPermissao => usuarioPermissao.permissao)
  usuariosPermissoes: UsuarioPermissao[];
}
