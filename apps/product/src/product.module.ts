import { MysqlModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MysqlModule.register([], process.env.MYSQL_PRODUCT_URI),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
