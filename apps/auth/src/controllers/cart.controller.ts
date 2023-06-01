import { RmqService } from '@app/common';
import { CreateCartDto, QueryUserDto } from '@app/gobal';
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

  @MessagePattern({ cmd: 'create-cart' })
  async list(
    @Ctx() context: RmqContext,
    @Payload() createCartDto: CreateCartDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.cartService.create(createCartDto);
  }
}
