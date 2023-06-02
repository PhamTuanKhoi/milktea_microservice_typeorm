import { OrtherEntity, OrtherItemEntity, ProductEntity } from '@app/common';
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
    @InjectRepository(OrtherItemEntity)
    private readonly ortherItemRepository: Repository<OrtherItemEntity>,
  ) {}

  @Process('create-orther')
  async create(job: Job<CreateOrtherDto>) {
    const { userId, orthersStringify } = job.data;
    const orthers = JSON.parse(orthersStringify);

    let products = [];

    try {
      for await (const item of orthers) {
        const ob$ = this.productProxy.send(
          { cmd: 'get-product-by-id' },
          item.productId,
        );

        const product: ProductEntity = await firstValueFrom(ob$).catch(
          (error) => this.logger.error(error),
        );

        products.push({
          ...product,
          totalPrice: product.price * item.quantity,
          quantity: item.quantity,
        });
      }

      const totalPrice = products.reduce((a, b) => a + b.totalPrice, 0);

      const orther = new OrtherEntity();
      orther.ortherer = userId;
      orther.totalPrice = totalPrice;

      const created_orther = await this.ortherRepository.save(orther);
      this.logger.log(`created a new orther by id#${created_orther?.id}`);

      return { products, orther: created_orther };
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name} with data  ...`);
  }

  @OnGlobalQueueCompleted()
  async create_orther_item(jobId: number, result: any) {
    try {
      const data: any = JSON.parse(result);

      for await (const product of data.products) {
        const item = new OrtherItemEntity();
        item.orther = data.orther.id;
        item.price = +product?.totalPrice;
        item.quantity = product.quantity;
        item.productId = product.id;

        const created_orther_item = await this.ortherItemRepository.save(item);
        this.logger.log(
          `created a new orther item by id#${created_orther_item?.id}`,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }

    this.logger.verbose(
      '(Global) on completed: job ',
      jobId,
      ' -> result: ',
      result,
    );
  }
}
