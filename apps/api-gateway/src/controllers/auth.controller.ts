import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authProxy: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() registerRequest) {
    return this.authProxy.send({ cmd: 'register' }, registerRequest);
  }
}
