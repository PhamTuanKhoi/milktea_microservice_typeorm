import {
  CartEntity,
  CartResponse,
  ProductEntity,
  UserEntity,
} from '@app/common';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  CreateCartDto,
  CustomText,
  ListEntiyReponse,
  PRODUCT_SERVICE,
  QueryCartDto,
} from '@app/gobal';
import { UserService } from './user.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly userService: UserService,
    @Inject(PRODUCT_SERVICE) private readonly productProxy: ClientProxy,
  ) {}

  async list(
    queryCartDto: QueryCartDto,
  ): Promise<ListEntiyReponse<CartEntity>> {
    const { limit, page, sortBy, sortType, ...q } = queryCartDto;

    const query: FindManyOptions = {};

    if (sortBy && sortType) query.order = { [sortBy]: sortType };

    query.relations = { orderer: true };

    let carts: CartResponse[] = await this.cartRepository.find(query);

    // get products by cart id
    const list_ob$ = carts.map((i) =>
      this.productProxy.send({ cmd: 'get-product-by-id' }, i.productId),
    );

    const promise_firstValueFrom = list_ob$.map((item) =>
      firstValueFrom(item).catch((error) => this.logger.error(error)),
    );

    const products: ProductEntity[] = await Promise.all(promise_firstValueFrom);

    carts.map((i) =>
      products.map((val) => (i.productId === val.id ? (i.product = val) : i)),
    );

    if (q.productId) carts = carts.filter((i) => i.productId === +q.productId);

    if (q.productName)
      carts = carts.filter((i) =>
        CustomText(i.product.name).includes(CustomText(q.productName)),
      );

    if (page && limit) carts = carts.slice((+page - 1) * +limit, +limit + 1);

    return {
      list: carts,
      count: carts.length,
      limit: +limit || 0,
      page: +page || 0,
    };
  }

  async create(createCartDto: CreateCartDto): Promise<CartEntity> {
    const { userId, productId, quantity } = createCartDto;

    try {
      const user = await this.userService.isModelExist(userId);

      const ob$ = this.productProxy.send({ cmd: 'exist-product' }, productId); // how to promise not await

      const product = await firstValueFrom(ob$).catch((error) =>
        this.logger.error(error),
      );

      if (!product)
        throw new HttpException(
          `product not found by id#${productId}`,
          HttpStatus.NOT_FOUND,
        );

      const cart = new CartEntity();
      cart.orderer = user;
      cart.productId = productId;
      cart.quantity = quantity;

      const created_cart = await this.cartRepository.save(cart);

      this.logger.log(`create a new cart by id#${created_cart?.id}`);
      return created_cart;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new BadRequestException();
    }
  }
}
