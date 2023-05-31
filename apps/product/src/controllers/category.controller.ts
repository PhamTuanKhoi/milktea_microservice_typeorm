import { RmqService } from '@app/common';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoryService } from '../services/category.service';

@Controller()
export class CategoryController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly categoryService: CategoryService,
  ) {}

  @MessagePattern({ cmd: 'create-category' })
  async create(@Ctx() context: RmqContext, @Payload() pay) {
    this.rmqService.acknowledgeMessage(context);

    return this.categoryService.create(pay);
  }

  @MessagePattern({ cmd: 'get-category' })
  async list(@Ctx() context: RmqContext) {
    this.rmqService.acknowledgeMessage(context);

    return 'hi';
  }
}
