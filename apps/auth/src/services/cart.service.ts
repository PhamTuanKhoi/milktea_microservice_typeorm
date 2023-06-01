import { CartEntity, UserEntity } from '@app/common';
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
import { CreateCartDto, PRODUCT_SERVICE } from '@app/gobal';
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

  // async list(queryUserDto: QueryUserDto): Promise<UserEntity[]> {
  //   const { name, limit, page, sortBy, sortType } = queryUserDto;

  //   const query: FindManyOptions = {};

  //   if (name)
  //     query.where = {
  //       name: ILike(`%${name}%`),
  //     };

  //   if (sortBy && sortType) query.order = { [sortBy]: 'DESC' };

  //   if (page) query.skip = (page - 1) * limit;

  //   if (limit) query.take = limit;

  //   return this.userRepository.find(query);
  // }

  async create(createCartDto: CreateCartDto) {
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
