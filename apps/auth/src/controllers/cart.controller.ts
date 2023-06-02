import { RmqService } from '@app/common';
import { CreateCartDto, QueryCartDto, QueryUserDto } from '@app/gobal';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';

@Controller()
export class CartController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly cartService: CartService,
  ) {}

  @MessagePattern({ cmd: 'get-carts' })
  async list(
    @Ctx() context: RmqContext,
    @Payload() queryCartDto: QueryCartDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.cartService.list(queryCartDto);
  }

  @MessagePattern({ cmd: 'create-cart' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() createCartDto: CreateCartDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.cartService.create(createCartDto);
  }
}
