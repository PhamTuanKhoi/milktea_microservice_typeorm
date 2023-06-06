import { RmqService } from '@app/common';
import { CreateOrtherDto, QueryOrtherDto } from '@app/gobal';
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
  async list(@Ctx() context: RmqContext, @Payload() queryOrtherDto) {
    this.rmqService.acknowledgeMessage(context);

    return this.ortherItemService.list(queryOrtherDto);
  }
}
