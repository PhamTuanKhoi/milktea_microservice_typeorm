import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../base/query.dto';

export class QueryCartDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  productId: number;
}
