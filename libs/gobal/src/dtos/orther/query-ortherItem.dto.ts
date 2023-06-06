import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { QueryDto } from '../base/query.dto';

export class QueryOrtherItemDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productName: string;
}
