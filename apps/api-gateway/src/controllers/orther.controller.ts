import { JwtAuthGuard, UserInterceptor } from '@app/common';
import { CreateOrtherDto, ORTHER_SERVICE, QueryOrtherDto } from '@app/gobal';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ORTHER')
@Controller('orther')
export class OrtherController {
  constructor(
    @Inject(ORTHER_SERVICE) private readonly ortherProxy: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async list(@Query() queryOrtherDto: QueryOrtherDto) {
    return this.ortherProxy.send({ cmd: 'get-orthers' }, queryOrtherDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async create(@Body() createOrtherDto: CreateOrtherDto) {
    return this.ortherProxy.send({ cmd: 'create-orther' }, createOrtherDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async delete(@Param('id') id: number) {
    return this.ortherProxy.send({ cmd: 'delete-orther' }, id);
  }
}
