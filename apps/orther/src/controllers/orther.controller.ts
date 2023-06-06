import { RmqService } from '@app/common';
import { CreateOrtherDto, QueryOrtherDto } from '@app/gobal';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { OrtherService } from '../services/orther.service';

@Controller()
export class OrtherController {
  constructor(
    private readonly ortherService: OrtherService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'get-orthers' })
  async list(
    @Ctx() context: RmqContext,
    @Payload() queryOrtherDto: QueryOrtherDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.ortherService.list(queryOrtherDto);
  }

  @MessagePattern({ cmd: 'create-orther' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() createOrtherDto: CreateOrtherDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.ortherService.create(createOrtherDto);
  }

  @MessagePattern({ cmd: 'delete-orther' })
  async delete(@Ctx() context: RmqContext, @Payload() id: number) {
    this.rmqService.acknowledgeMessage(context);

    return this.ortherService.delete(id);
  }
}
