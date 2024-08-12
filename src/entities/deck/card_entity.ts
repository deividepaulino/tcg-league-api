// src/entities/card.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Deck } from './deck_entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  type: number; // 0 = proxy, 1 = padrão

  @ManyToOne(() => Deck, deck => deck.cards)
  deck: Deck;
}
