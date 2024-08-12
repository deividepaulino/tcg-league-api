// src/decks/deck.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { DeckService } from './deck.service';
import { Deck } from 'src/entities/deck/deck_entity';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Get()
  findAll(): Promise<Deck[]> {
    return this.deckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Deck> {
    return this.deckService.findOne(id);
  }

  @Post()
  create(@Body() deck: Deck): Promise<Deck> {
    return this.deckService.create(deck);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() deck: Partial<Deck>): Promise<Deck> {
    return this.deckService.update(id, deck);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.deckService.remove(id);
  }

  @Get('user/:usuarioId')
  findByUserId(@Param('usuarioId') usuarioId: number): Promise<Deck[]> {
    return this.deckService.findByUserId(usuarioId);
  }
}
