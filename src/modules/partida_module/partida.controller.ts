import { Controller, Get, Post, Put, Delete, Param, Body, Req } from '@nestjs/common';
import { PartidaService } from './partida.service';

@Controller('partidas')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) {}

  @Get()
  findAll() {
    return this.partidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.partidaService.findOne(id);
  }

  @Get('player/:playerId')
  findByPlayerId(@Param('playerId') playerId: number) {
    return this.partidaService.findByPlayerId(playerId);
  }

  @Post()
  create(@Body('jogador1Id') jogador1Id: number, @Body('jogador2Id') jogador2Id: number) {
    return this.partidaService.create(jogador1Id, jogador2Id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body('placarJogador1') placarJogador1: number,
    @Body('placarJogador2') placarJogador2: number,
  ) {
    return this.partidaService.update(id, placarJogador1, placarJogador2);
  }

  @Put(':id/finish')
  finish(@Param('id') id: number) {
    return this.partidaService.finish(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.partidaService.remove(id);
  }
}
