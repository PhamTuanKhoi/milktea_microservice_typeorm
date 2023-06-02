import { JwtAuthGuard, UserInterceptor } from '@app/common';
import { CreateCartDto, QueryCartDto, QueryUserDto } from '@app/gobal';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CART')
@Controller('cart')
export class CartController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authProxy: ClientProxy,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  list(@Query() queryCartDto: QueryCartDto) {
    return this.authProxy.send({ cmd: 'get-carts' }, queryCartDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  create(@Body() createCartDto: CreateCartDto) {
    return this.authProxy.send({ cmd: 'create-cart' }, createCartDto);
  }
}
