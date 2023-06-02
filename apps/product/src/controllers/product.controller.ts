import { RmqService } from '@app/common';
import {
  CreateProductDto,
  QueryCategoryDto,
  QueryProductDto,
} from '@app/gobal';
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
    @Payload() queryProductDto: QueryProductDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.productService.list(queryProductDto);
  }

  @MessagePattern({ cmd: 'get-product-by-id' })
  async findById(@Ctx() context: RmqContext, @Payload() productId: number) {
    this.rmqService.acknowledgeMessage(context);

    return this.productService.findById(productId);
  }

  @MessagePattern({ cmd: 'create-product' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() createProductDto: CreateProductDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.productService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'exist-product' })
  async isExistProduct(
    @Ctx() context: RmqContext,
    @Payload() productId: number,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.productService.isExistModel(productId);
  }
}
