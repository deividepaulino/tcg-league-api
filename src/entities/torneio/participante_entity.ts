import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Torneio } from './torneio_entity';
import { Usuario } from '../user_entity';
import { Deck } from '../deck/deck_entity';

@Entity('participantes')
export class Participante {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Torneio, torneio => torneio.participantes)
  @JoinColumn({ name: 'torneio_id' })
  torneio: Torneio;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Deck)
  @JoinColumn({ name: 'deck_id' })
  deck: Deck;
}
