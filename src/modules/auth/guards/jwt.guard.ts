import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtSettings } from '@App/config/configuration';
import { AuthService } from '@App/modules/auth/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const authorization = request.headers['authorization'];

      if (!authorization || Array.isArray(authorization)) {
        throw new Error('Invalid Authorization Header');
      }
      const [_, token] = authorization.split(' ');
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<JwtSettings>('jwt').jwtSecret,
      });

      const { sub } = decodedToken;
      const foundUser = await this.authService.findOneById(sub);
      request['user'] = foundUser;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
