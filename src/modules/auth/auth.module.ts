import { Module } from '@nestjs/common';
import { AuthController } from '@App/modules/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@App/modules/auth/entities/user.entity';
import { AuthService } from '@App/modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtSettings } from '@App/config/configuration';
import { EmailExistsValidator } from '@App/modules/auth/validators/email-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        const jwtConfig = config.get<JwtSettings>('jwt');
        if (!jwtConfig) {
          throw new Error('JWT configuration is missing in ConfigService');
        }

        return {
          secret: jwtConfig.jwtSecret,
          signOptions: {
            algorithm: jwtConfig.algorithm,
            expiresIn: jwtConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailExistsValidator],
  exports: [AuthService, EmailExistsValidator],
})
export class AuthModule {}
