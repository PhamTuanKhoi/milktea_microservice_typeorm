import { JwtAuthGuard } from '@app/common';
import { AUTH_SERVICE, CATEGORY_SERVICE, QueryUserDto } from '@app/gobal';
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

@ApiTags('CATEGORY')
@Controller('categories')
export class CategoryController {
  constructor(
    @Inject(CATEGORY_SERVICE) private readonly categoryProxy: ClientProxy,
  ) {}

  @Post()
  async create(@Body() pay) {
    return this.categoryProxy.send({ cmd: 'create-category' }, pay);
  }

  @Get()
  async list() {
    return this.categoryProxy.send({ cmd: 'get-category' }, {});
  }
}
