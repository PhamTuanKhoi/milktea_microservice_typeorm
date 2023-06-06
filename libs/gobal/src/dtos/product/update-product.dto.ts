// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId: number;
}
