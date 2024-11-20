import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@App/app.controller';
import { AppService } from '@App/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('check-health', () => {
    it('should return "Works"', () => {
      expect(appController.checkHealth()).toBe('Works');
    });
  });
});
