import { LoginRequest, RegisterRequest } from '@app/gobal';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authProxy: ClientProxy,
  ) {}

  @Post('login')
  login(@Body() loginRequest: LoginRequest) {
    return this.authProxy.send({ cmd: 'login' }, loginRequest);
  }

  @Post('register')
  register(@Body() registerRequest: RegisterRequest) {
    return this.authProxy.send({ cmd: 'register' }, registerRequest);
  }
}
