import { RmqService } from '@app/common';
import { QueryUserDto } from '@app/gobal';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async list(
    @Ctx() context: RmqContext,
    @Payload() queryUserDto: QueryUserDto,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.userService.list(queryUserDto);
  }

  @MessagePattern({ cmd: 'exist-user' })
  async exist_user(@Ctx() context: RmqContext, @Payload() userId: number) {
    this.rmqService.acknowledgeMessage(context);

    return this.userService.isModelExist(userId);
  }
}
