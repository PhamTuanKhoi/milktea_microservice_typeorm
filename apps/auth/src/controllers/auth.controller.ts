import { RmqService } from '@app/common';
import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RegisterRequest } from 'libs/gobal/src';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'register' })
  async register(
    @Ctx() context: RmqContext,
    @Payload() registerRequest: RegisterRequest,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.authService.register(registerRequest);
  }
}
