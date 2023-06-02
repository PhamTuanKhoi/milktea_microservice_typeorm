import { JwtAuthGuard, UserInterceptor } from '@app/common';
import {
  CreateOrtherDto,
  CreateProductDto,
  ORTHER_SERVICE,
  PRODUCT_SERVICE,
  QueryOrtherDto,
  QueryProductDto,
} from '@app/gobal';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@ApiTags('ORTHER')
@Controller('orther')
export class OrtherController {
  constructor(
    @Inject(ORTHER_SERVICE) private readonly ortherProxy: ClientProxy,
    @InjectQueue('test') private audioQueue: Queue,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async list(@Body() queryOrtherDto: QueryOrtherDto) {
    return this.ortherProxy.send({ cmd: 'get-orthers' }, queryOrtherDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async create(@Body() createOrtherDto: CreateOrtherDto) {
    return this.ortherProxy.send({ cmd: 'create-orther' }, createOrtherDto);
  }
}
