import { JwtAuthGuard, UserInterceptor } from '@app/common';
import { CreateProductDto, PRODUCT_SERVICE, QueryProductDto } from '@app/gobal';
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

@ApiTags('PRODUCT')
@Controller('product')
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productProxy: ClientProxy,
  ) {}

  @Get()
  async list(@Query() queryProductDto: QueryProductDto) {
    return this.productProxy.send({ cmd: 'get-products' }, queryProductDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productProxy.send({ cmd: 'create-product' }, createProductDto);
  }
}
