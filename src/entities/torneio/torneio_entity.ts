import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Participante } from './participante_entity';
import { Classificacao } from './classificacao_entity';

@Entity('torneios')
export class Torneio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  nome: string;

  @Column({ type: 'text', default: 'ativo' })
  status: 'ativo' | 'encerrado' | 'cancelado';

  @Column({ type: 'date' })
  data_abertura: Date;

  @Column({ type: 'date', nullable: true })
  data_encerramento?: Date;

  @OneToMany(() => Participante, participante => participante.torneio)
  participantes: Participante[];

  @OneToMany(() => Classificacao, classificacao => classificacao.torneio)
  classificacoes: Classificacao[];
}
