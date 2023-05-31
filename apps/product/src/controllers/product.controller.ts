import { RmqService } from '@app/common';
import { QueryCategoryDto } from '@app/gobal';
import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ProductService } from '../services/product.service';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'get-products' })
  async list(
    @Ctx() context: RmqContext,
    @Payload() queryCategoryDto: QueryCategoryDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.productService.list(queryCategoryDto);
  }
}
