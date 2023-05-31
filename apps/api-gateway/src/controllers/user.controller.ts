import { JwtAuthGuard } from '@app/common';
import { QueryUserDto } from '@app/gobal';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authProxy: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Query() queryUserDto: QueryUserDto) {
    return this.authProxy.send({ cmd: 'get-users' }, queryUserDto);
  }
}
