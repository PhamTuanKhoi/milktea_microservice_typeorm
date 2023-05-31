import { PRODUCT_SERVICE, QueryProductDto } from '@app/gobal';
import { Controller, Get, Inject, Query } from '@nestjs/common';
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
}
