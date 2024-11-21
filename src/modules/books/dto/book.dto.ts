import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class BookDto {
  @ApiProperty({
    description: 'Book name',
    type: String,
    example: 'Gang of Four',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The number of book pages',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsPositive()
  numberOfPages: number;
}
