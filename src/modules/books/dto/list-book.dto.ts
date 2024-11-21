import { IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '@App/modules/shared/dto/pagination.dto';

export class ListBookDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter books by name',
    type: String,
    required: false,
    example: 'gang of four',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by book pages number',
    type: Number,
    required: false,
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  numberOfPages?: number;
}
