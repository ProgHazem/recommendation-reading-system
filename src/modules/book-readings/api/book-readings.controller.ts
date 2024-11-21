import { UserRolesDecorator } from '@App/modules/auth/decorators/role.decarator';
import Role from '@App/modules/auth/enums/role.enum';
import { JwtGuard } from '@App/modules/auth/guards/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guards/role.guard';
import { BookReadingsService } from '@App/modules/book-readings/book-readings.service';
import { StoreReadingIntervalDto } from '@App/modules/book-readings/dto/store-reading-interval.dto';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@UserRolesDecorator(Role.USER)
@UseGuards(JwtGuard, RoleGuard)
@ApiTags('Reading Book')
@ApiBearerAuth()
@Controller({ path: 'book-readings', version: ['1'] })
export class BookReadingsController {
  constructor(private readonly bookReadingsService: BookReadingsService) {}

  @Post('/save-interval')
  @ApiOperation({ summary: 'Create a new reading booking interval' })
  @ApiBody({
    description: 'Data for creating a new reading interval',
    type: StoreReadingIntervalDto,
  })
  async create(
    @Body() createReadingIntervalDto: StoreReadingIntervalDto,
    @Req() request: Request,
  ) {
    return this.bookReadingsService.create(
      request['user'],
      createReadingIntervalDto,
    );
  }
}
