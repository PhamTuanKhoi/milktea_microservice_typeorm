import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../base/query.dto';

export class QueryProductDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId: number;
}
