import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { QueryDto } from '../base/query.dto';

export class QueryOrtherDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId: number;
}
