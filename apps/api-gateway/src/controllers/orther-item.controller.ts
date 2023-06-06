import { JwtAuthGuard, UserInterceptor } from '@app/common';
import { ORTHER_SERVICE } from '@app/gobal';
import {
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ORTHER-ITEM')
@Controller('orther-item')
export class OrtherItemController {
  constructor(
    @Inject(ORTHER_SERVICE) private readonly ortherItemProxy: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  async list(@Query() queryOrtherDto) {
    return this.ortherItemProxy.send(
      { cmd: 'get-ortherItems' },
      queryOrtherDto,
    );
  }
}
