import { RmqService } from '@app/common';
import { LoginRequest, RegisterRequest } from '@app/gobal';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { JwtAuthGuard } from '../gaurd/jwt-gaurd';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  // @UseGuards(LocalAuthGuard)
  async login(
    @Ctx() context: RmqContext,
    @Payload() loginRequest: LoginRequest,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.authService.login(loginRequest);
  }

  @MessagePattern({ cmd: 'register' })
  async register(
    @Ctx() context: RmqContext,
    @Payload() registerRequest: RegisterRequest,
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.authService.register(registerRequest);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtAuthGuard)
  async verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.authService.verifyJwt(payload.jwt);
  }

  @MessagePattern({ cmd: 'decode-jwt' })
  async decodeJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.rmqService.acknowledgeMessage(context);

    return this.authService.decodeJwt(payload.jwt);
  }
}
