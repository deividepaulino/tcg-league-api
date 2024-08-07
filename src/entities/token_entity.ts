import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Usuario } from './user_entity';

@Entity('token')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column()
  token: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @Column({ type: 'datetime', nullable: true })
  data_expiracao: Date;

  @ManyToOne(() => Usuario, usuario => usuario.tokens)
  usuario: Usuario;
}
