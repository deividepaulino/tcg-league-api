import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Token } from './token_entity';
import { Deck } from './deck/deck_entity';

@Entity('usuarios') // 'usuarios' para pluralidade, se estiver seguindo a convenção
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  sobrenome: string;

  @Column()
  idade: number;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ default: false })
  emailConfirmado: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @OneToMany(() => Token, token => token.usuario)
  tokens: Token[];

  @OneToMany(() => Deck, deck => deck.usuario)
  decks: Deck[];
}
