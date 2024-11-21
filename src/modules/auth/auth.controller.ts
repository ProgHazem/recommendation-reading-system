import { AuthService } from '@App/modules/auth/auth.service';
import { LoginDto } from '@App/modules/auth/dto/login.dto';
import { RegisterDto } from '@App/modules/auth/dto/register.dto';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
