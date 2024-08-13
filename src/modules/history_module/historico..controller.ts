import { Controller, Get, Param } from '@nestjs/common';
import { HistoricoPartidaService } from './historico..service';

@Controller('historico-partidas')
export class HistoricoPartidaController {
 constructor(private readonly historicoPartidaService: HistoricoPartidaService) {}

  @Get()
  findAll() {
    return this.historicoPartidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.historicoPartidaService.findOne(id);
  }

  @Get('/usuario/:usuarioId')
  findByUsuario(@Param('usuarioId') usuarioId: number) {
    return this.historicoPartidaService.findByUsuario(usuarioId);
  }
}
