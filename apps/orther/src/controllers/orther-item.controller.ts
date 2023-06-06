import { RmqService } from '@app/common';
import {
  CreateOrtherDto,
  QueryOrtherDto,
  QueryOrtherItemDto,
} from '@app/gobal';
import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { OrtherItemService } from '../services/orther-item.service';

@Controller()
export class OrtherItemController {
  constructor(
    private readonly ortherItemService: OrtherItemService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'get-ortherItems' })
  async list(
    @Ctx() context: RmqContext,
    @Payload() queryOrtherItemDto: QueryOrtherItemDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.ortherItemService.list(queryOrtherItemDto);
  }
}
