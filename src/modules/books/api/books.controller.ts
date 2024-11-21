import { UserRolesDecorator } from '@App/modules/auth/decorators/role.decarator';
import Role from '@App/modules/auth/enums/role.enum';
import { JwtGuard } from '@App/modules/auth/guards/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guards/role.guard';
import { BooksService } from '@App/modules/books/books.service';
import { ListBookDto } from '@App/modules/books/dto/list-book.dto';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@UserRolesDecorator(Role.USER)
@UseGuards(RoleGuard)
@UseGuards(JwtGuard)
@ApiTags('Api Books')
@ApiBearerAuth()
@Controller({ path: 'books', version: ['1'] })
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of books retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  async findAll(@Query() bookFilterDto: ListBookDto) {
    return this.bookService.findAll(bookFilterDto);
  }
}
