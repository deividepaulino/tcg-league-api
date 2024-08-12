import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Torneio } from './torneio_entity';
import { Usuario } from '../user_entity';
import { Deck } from '../deck/deck_entity';

@Entity('classificao')
export class Classificacao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Torneio, torneio => torneio.classificacoes)
  @JoinColumn({ name: 'torneio_id' })
  torneio: Torneio;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Deck)
  @JoinColumn({ name: 'deck_id' })
  deck: Deck;

  @Column({ type: 'int', nullable: true })
  posicao?: number;

  @Column({ type: 'int', default: 0 })
  pontuacao: number;

  @Column({ type: 'int', default: 0 })
  vitorias: number;
}
