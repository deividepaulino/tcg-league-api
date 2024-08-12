import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user_entity';
import { Permissao } from './entities/permission_entity';
import { Token } from './entities/token_entity';
import { UsuarioPermissao } from './entities/user_permission';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './users/user_module';
import { CustomAuthGuard } from './core/guards/jwt-auth.guard';
import { Deck } from './entities/deck/deck_entity';
import { Card } from './entities/deck/card_entity';
import { DeckModule } from './modules/deck_module/deck.module';
import { PartidaModule } from './modules/partida_module/partica.module';
import { TorneioModule } from './modules/torneio_module/torneio.module';
import { HistoricoPartidaModule } from './modules/history_module/historico.module';
import { Partida } from './entities/partida_entity';
import { Classificacao } from './entities/torneio/classificacao_entity';
import { Participante } from './entities/torneio/participante_entity';
import { Torneio } from './entities/torneio/torneio_entity';
import { HistoricoPartida } from './entities/historico_partidas_entity';

@Module({
  imports: [

   TypeOrmModule.forRoot({
  type: 'sqlite',
  database: './db/tcg.db',
  entities: [
    Usuario,
    Permissao,
    Token,
    UsuarioPermissao,
    Deck,
    Card,
    Partida,
    Classificacao,
    Participante,
    Torneio,
    HistoricoPartida,
  ],
  synchronize: true,
}),

    AuthModule, // Importa o AuthModule para usar o JwtService
    UsuarioModule,
    DeckModule,
    PartidaModule,
    TorneioModule,
    HistoricoPartidaModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: CustomAuthGuard,
    // },
  ],
})
export class AppModule {}
