import { JwtAuthGuard, UserInterceptor } from '@app/common';
import { CreateCartDto, QueryUserDto } from '@app/gobal';
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

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  create(@Body() createCartDto: CreateCartDto) {
    return this.authProxy.send({ cmd: 'create-cart' }, createCartDto);
  }
}
