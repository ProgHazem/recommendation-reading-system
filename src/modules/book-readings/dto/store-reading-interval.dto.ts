import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsUUID, ValidateIf } from 'class-validator';

export class StoreReadingIntervalDto {
  @ApiProperty({
    description: 'The starting page number of the reading interval',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @ValidateIf(
    (o) =>
      (o.startPage !== undefined && o.endPage !== undefined) ||
      o.startPage <= o.endPage,
  )
  @IsPositive()
  startPage: number;

  @ApiProperty({
    description: 'The ending page number of the reading interval',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsPositive()
  endPage: number;

  @ApiProperty({
    description:
      'The unique identifier for the book associated with the reading interval',
    type: String,
    format: 'uuid',
    example: '1f194333-f9c9-43c2-b406-d8c03803867c',
  })
  @IsNotEmpty()
  @IsUUID()
  bookId: string;
}
