import { OrtherItemEntity, ProductEntity, UserEntity } from '@app/common';
import { OrtherItemResponse } from '@app/common/interface/type/orther-item.respone';
import {
  AUTH_SERVICE,
  CustomText,
  ListEntiyReponse,
  PRODUCT_SERVICE,
  QueryOrtherItemDto,
} from '@app/gobal';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class OrtherItemService {
  private readonly logger = new Logger(OrtherItemService.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authProxy: ClientProxy,
    @Inject(PRODUCT_SERVICE) private readonly productProxy: ClientProxy,
    @InjectRepository(OrtherItemEntity)
    private readonly ortherItemRepository: Repository<OrtherItemEntity>,
  ) {}

  async list(
    queryOrtherItemDto: QueryOrtherItemDto,
  ): Promise<ListEntiyReponse<OrtherItemEntity>> {
    const { userId, page, limit, sortBy, sortType, ...q } = queryOrtherItemDto;

    let query: FindManyOptions = {};

    if (sortBy && sortType) query.order = { [sortBy]: sortType };

    query.relations = { orther: true };

    let ortherItems: OrtherItemResponse[] =
      await this.ortherItemRepository.find(query);

    // get and validate user by user id
    const users: UserEntity[] = await this.getAndValidateUserById(ortherItems);

    // get and validate product by product id
    const products: ProductEntity[] = await this.getAndValidateProductById(
      ortherItems,
    );

    // add user at ortherItems
    ortherItems.map((i) =>
      users.map((val) => (i.orther.ortherer === val.id ? (i.user = val) : i)),
    );

    // add product at ortherItems
    ortherItems.map((i) =>
      products.map((val) => (i.productId === val.id ? (i.product = val) : i)),
    );

    if (userId)
      ortherItems = ortherItems.filter((item) => item?.user?.id === +userId);

    if (q.productName)
      ortherItems = ortherItems.filter((item) =>
        CustomText(item?.product.name).includes(CustomText(q.productName)),
      );

    if (page && limit)
      ortherItems = ortherItems.slice(
        (+page - 1) * +limit,
        +limit + (+page - 1),
      );

    return {
      list: ortherItems,
      count: ortherItems.length,
      limit: +limit || 0,
      page: +page || 0,
    };
  }

  async getAndValidateUserById(ortherItems: OrtherItemResponse[]) {
    try {
      const list_user_ob$ = ortherItems.map((i) =>
        this.authProxy.send({ cmd: 'exist-user' }, i.orther.ortherer),
      );

      const promise_firstValueFrom_users = list_user_ob$.map((item) =>
        firstValueFrom(item).catch((error) => this.logger.error(error)),
      );

      return await Promise.all(promise_firstValueFrom_users);
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  async getAndValidateProductById(ortherItems: OrtherItemResponse[]) {
    try {
      const list_product_ob$ = ortherItems.map((i) =>
        this.productProxy.send({ cmd: 'exist-product' }, i.productId),
      );

      const promise_firstValueFrom_product = list_product_ob$.map((item) =>
        firstValueFrom(item).catch((error) => this.logger.error(error)),
      );

      return await Promise.all(promise_firstValueFrom_product);
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }
}
