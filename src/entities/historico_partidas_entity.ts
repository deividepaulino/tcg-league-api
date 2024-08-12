import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './user_entity';
import { Deck } from './deck/deck_entity';
import { Torneio } from './torneio/torneio_entity';

@Entity('historico_partidas')
export class HistoricoPartida {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'jogador1_id' })
  jogador1: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'jogador2_id' })
  jogador2: Usuario;

  @Column({ type: 'text', enum: ['jogador1', 'jogador2', 'empate'] })
  resultado: 'jogador1' | 'jogador2' | 'empate';

  @ManyToOne(() => Deck)
  @JoinColumn({ name: 'deck1_id' })
  deck1: Deck;

  @ManyToOne(() => Deck)
  @JoinColumn({ name: 'deck2_id' })
  deck2: Deck;

  @Column({ type: 'date' })
  data_partida: Date;

  @Column({ type: 'text' })
  nome_oponente: string;

  @ManyToOne(() => Torneio, { nullable: true })
  @JoinColumn({ name: 'torneio_id' })
  torneio?: Torneio;
}
