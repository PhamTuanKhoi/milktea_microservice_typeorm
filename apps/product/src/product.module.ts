import {
  CategoryEntity,
  MysqlModule,
  ProductEntity,
  RmqModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryController } from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MysqlModule.register(
      [CategoryEntity, ProductEntity],
      process.env.MYSQL_PRODUCT_URI,
    ),
    RmqModule,
  ],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
