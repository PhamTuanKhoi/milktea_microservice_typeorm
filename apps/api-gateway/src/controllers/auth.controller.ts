import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterRequest } from 'libs/gobal/src';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authProxy: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() registerRequest: RegisterRequest) {
    return this.authProxy.send({ cmd: 'register' }, registerRequest);
  }
}
