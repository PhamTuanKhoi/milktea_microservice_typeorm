import { OrtherEntity, ProductEntity } from '@app/common';
import {
  BULL_ORTHER_QUEUE,
  CreateOrtherDto,
  PRODUCT_SERVICE,
} from '@app/gobal';
import {
  Processor,
  Process,
  OnQueueActive,
  OnGlobalQueueCompleted,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Processor(BULL_ORTHER_QUEUE)
export class OrtherConsumer {
  private readonly logger = new Logger(OrtherConsumer.name);

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productProxy: ClientProxy,
    @InjectRepository(OrtherEntity)
    private readonly ortherRepository: Repository<OrtherEntity>,
  ) {}

  @Process('create-orther')
  async create(job: Job<CreateOrtherDto>) {
    const { userId, orthersStringify } = job.data;
    const orthers = JSON.parse(orthersStringify);

    let result = [];

    for await (const item of orthers) {
      const ob$ = this.productProxy.send(
        { cmd: 'get-product-by-id' },
        item.productId,
      );

      const product: ProductEntity = await firstValueFrom(ob$).catch((error) =>
        this.logger.error(error),
      );

      const orther = new OrtherEntity();
      orther.ortherer = userId;
      orther.totalPrice = +item.quantity * +product.price;

      const created_orther = await this.ortherRepository.save(orther);
      this.logger.log(`created a new orther by id#${created_orther?.id}`);

      result = [
        ...result,
        { ...created_orther, quantity: item.quantity, product },
      ];
    }

    return result;
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name} with data  ...`);
  }

  @OnGlobalQueueCompleted()
  async create_orther_item(job: Job, result: any) {
    console.log(result);
  }
}
