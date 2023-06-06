import { JwtAuthGuard, UserInterceptor } from '@app/common';
import { QueryUserDto, UpdateUserDto } from '@app/gobal';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.authProxy.send(
      { cmd: 'update-user' },
      { ...updateUserDto, id },
    );
  }
}
