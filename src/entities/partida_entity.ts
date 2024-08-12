import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './user_entity';

@Entity('partidas')
export class Partida {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'jogador1_id' })
  jogador1: Usuario;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'jogador2_id' })
  jogador2: Usuario;

  @Column({ type: 'int', default: 0 })
  placar_jogador1: number;

  @Column({ type: 'int', default: 0 })
  placar_jogador2: number;

  @Column({ type: 'text', default: 'em andamento' })
  status: 'em andamento' | 'finalizado';
}
