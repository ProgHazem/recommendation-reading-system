import { Controller, Get } from '@nestjs/common';
import { AppService } from '@App/app.service';

@Controller({ path: 'dashboard', version: ['1'] })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('check-health')
  checkHealth(): string {
    return this.appService.checkHealth();
  }
}
