// src/entities/deck.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Card } from './card_entity';
import { Usuario } from '../user_entity';

@Entity('decks')
export class Deck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deck_name: string;

  @Column()
  deck_game: string;

  @Column()
  deck_format: string;

  @Column()
  card_quantity: number;

  @Column()
  proxy_quantity: number;

  @ManyToOne(() => Usuario, usuario => usuario.decks) // ManyToOne relation
  usuario: Usuario;

  @OneToMany(() => Card, card => card.deck, { cascade: true, eager: true })
  cards: Card[];
}
