import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Classificacao } from 'src/entities/torneio/classificacao_entity';
import { Participante } from 'src/entities/torneio/participante_entity';
import { Torneio } from 'src/entities/torneio/torneio_entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TorneioService {
  constructor(
    @InjectRepository(Torneio)
    private readonly torneioRepository: Repository<Torneio>,
    @InjectRepository(Participante)
    private readonly participanteRepository: Repository<Participante>,
    @InjectRepository(Classificacao)
    private readonly classificacaoRepository: Repository<Classificacao>,
  ) {}

    private generateUniqueCode(length: number = 8): string {
    return randomBytes(length).toString('hex').slice(0, length).toUpperCase();
  }


  async create(nome: string, dataAbertura: Date, dataEncerramento?: Date): Promise<Torneio> {
    const codigo = this.generateUniqueCode();

    const torneio = this.torneioRepository.create({
      nome,
      data_abertura: dataAbertura,
      data_encerramento: dataEncerramento,
      codigo, // Adicione o código gerado
    });

    return this.torneioRepository.save(torneio);
  }

  async findOne(id: number): Promise<Torneio> {
    const torneio = await this.torneioRepository.findOne({
      where: { id },
      relations: ['participantes', 'classificacoes'],
    });
    if (!torneio) {
      throw new NotFoundException(`Torneio com id ${id} não encontrado`);
    }
    return torneio;
  }

  async findAll(): Promise<Torneio[]> {
    return this.torneioRepository.find();
  }

   async findByUserId(userId: number) {
    // Busca os torneios onde o usuário está participando
    const torneios = await this.participanteRepository
      .createQueryBuilder('participante')
      .leftJoinAndSelect('participante.torneio', 'torneio')
      .where('participante.usuarioId = :userId', { userId })
      .getMany();

    // Extrai a lista de torneios únicos
    const uniqueTorneios = torneios.map(participante => participante.torneio);
    return uniqueTorneios;
  }
}
