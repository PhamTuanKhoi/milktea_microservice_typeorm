import {
  AUTH_SERVICE,
  BULL_ORTHER_QUEUE,
  CreateOrtherDto,
  ListEntiyReponse,
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
import { OrtherEntity, OrtherResponse, UserEntity } from '@app/common';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class OrtherService {
  private readonly logger = new Logger(OrtherService.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authProxy: ClientProxy,
    @InjectQueue(BULL_ORTHER_QUEUE) private readonly otherBullQueue: Queue,
    @InjectRepository(OrtherEntity)
    private readonly ortherRepository: Repository<OrtherEntity>,
  ) {}

  async list(
    queryOrtherDto: QueryOrtherDto,
  ): Promise<ListEntiyReponse<OrtherEntity>> {
    const { userId, page, limit, sortBy, sortType, ...q } = queryOrtherDto;

    let query: FindManyOptions = {};

    if (sortBy && sortType) query.order = { [sortBy]: sortType };

    query.relations = { ortherItems: true };

    let orthers: OrtherResponse[] = await this.ortherRepository.find(query);

    // get and validate user by user id
    const users: UserEntity[] = await this.getAndValidateUserById(orthers);

    orthers.map((i) =>
      users.map((val) => (i.ortherer === val.id ? (i.user = val) : i)),
    );

    if (userId) orthers = orthers.filter((item) => item?.user?.id === +userId);

    if (page && limit)
      orthers = orthers.slice((+page - 1) * +limit, +limit + (+page - 1));

    return {
      list: orthers,
      count: orthers.length,
      limit: +limit || 0,
      page: page || 0,
    };
  }

  async getAndValidateUserById(orthers: OrtherResponse[]) {
    try {
      const list_ob$ = orthers.map((i) =>
        this.authProxy.send({ cmd: 'exist-user' }, i.ortherer),
      );

      const promise_firstValueFrom = list_ob$.map((item) =>
        firstValueFrom(item).catch((error) => this.logger.error(error)),
      );

      return await Promise.all(promise_firstValueFrom);
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
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
