// src/decks/deck.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from 'src/entities/deck/deck_entity';

@Injectable()
export class DeckService {
  constructor(
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
  ) {}

  findAll(): Promise<Deck[]> {
    return this.deckRepository.find();
  }

  findOne(id: number): Promise<Deck> {
    return this.deckRepository.findOneBy({ id });
  }

  create(deck: Deck): Promise<Deck> {
    return this.deckRepository.save(deck);
  }

  async update(id: number, deck: Partial<Deck>): Promise<Deck> {
    await this.deckRepository.update(id, deck);
    return this.deckRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.deckRepository.delete(id);
  }

  // Novo método para encontrar decks por usuário
  findByUserId(usuarioId: number): Promise<Deck[]> {
    return this.deckRepository.find({ where: { usuario: { id: usuarioId } } });
  }
}
