// src/decks/deck.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from 'src/entities/deck/deck_entity';
import { Card } from 'src/entities/deck/card_entity';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Deck, Card])],
  providers: [DeckService],
  controllers: [DeckController],
})
export class DeckModule {}
