import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TorneioService } from './torneio.service';

@Controller('torneios')
export class TorneioController {
  constructor(private readonly torneioService: TorneioService) {}

  @Post()
  create(
    @Body('nome') nome: string,
    @Body('data_abertura') dataAbertura: Date,
    @Body('data_encerramento') dataEncerramento?: Date,
  ) {
    return this.torneioService.create(nome, dataAbertura, dataEncerramento);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.torneioService.findOne(id);
  }

  @Get()
  findAll() {
    return this.torneioService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: number) {
    return this.torneioService.findByUserId(userId);
  }
}
