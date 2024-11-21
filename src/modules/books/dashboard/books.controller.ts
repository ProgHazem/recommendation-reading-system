import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRolesDecorator } from '@App/modules/auth/decorators/role.decarator';
import Role from '@App/modules/auth/enums/role.enum';
import { JwtGuard } from '@App/modules/auth/guards/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guards/role.guard';
import { BooksService } from '@App/modules/books/books.service';
import { BookDto } from '@App/modules/books/dto/book.dto';
import { ListBookDto } from '@App/modules/books/dto/list-book.dto';

@ApiTags('Dashboard Books')
@ApiBearerAuth()
@UserRolesDecorator(Role.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
@Controller({ path: 'dashboard/books', version: ['1'] })
export class DashboardBooksController {
  constructor(private readonly bookService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create book' })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation error.',
  })
  @ApiBody({
    description: 'creating a Book Dto',
    type: BookDto,
  })
  async create(@Body() createBookDto: BookDto) {
    return this.bookService.create(createBookDto);
  }

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

  @Put(':id')
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully Updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found.',
  })
  @ApiBody({
    description: 'updating a book dto',
    type: BookDto,
  })
  async update(@Param('id') id: string, @Body() book: BookDto) {
    return this.bookService.update(id, book);
  }
}
