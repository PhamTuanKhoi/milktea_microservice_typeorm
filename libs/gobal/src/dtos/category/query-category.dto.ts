import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../base/query.dto';

export class QueryCategoryDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;
}
