import { JwtAuthGuard, UserInterceptor } from '@app/common';
import {
  CATEGORY_SERVICE,
  CreateCategoryDto,
  QueryCategoryDto,
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

@ApiTags('CATEGORY')
@Controller('categories')
export class CategoryController {
  constructor(
    @Inject(CATEGORY_SERVICE) private readonly categoryProxy: ClientProxy,
  ) {}

  @Get()
  async list(@Query() queryCategoryDto: QueryCategoryDto) {
    return this.categoryProxy.send({ cmd: 'get-category' }, queryCategoryDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryProxy.send(
      { cmd: 'create-category' },
      createCategoryDto,
    );
  }
}
