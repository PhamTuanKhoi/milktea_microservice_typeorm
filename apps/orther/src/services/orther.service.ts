import {
  BULL_ORTHER_QUEUE,
  CreateOrtherDto,
  PRODUCT_SERVICE,
  QueryOrtherDto,
} from '@app/gobal';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { OrtherEntity } from '@app/common';
import { Repository } from 'typeorm';

@Injectable()
export class OrtherService {
  private readonly logger = new Logger(OrtherService.name);

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productProxy: ClientProxy,
    @InjectQueue(BULL_ORTHER_QUEUE) private readonly otherBullQueue: Queue,
    @InjectRepository(OrtherEntity)
    private readonly ortherRepository: Repository<OrtherEntity>,
  ) {}

  async list(queryOrtherDto: QueryOrtherDto) {
    const data = await this.ortherRepository.find();

    return data;
  }

  async create(createOrtherDto: CreateOrtherDto) {
    try {
      return await this.otherBullQueue.add('create-orther', createOrtherDto);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new BadRequestException();
    }
  }
}
