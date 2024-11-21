import { LoginDto } from '@App/modules/auth/dto/login.dto';
import { RegisterDto } from '@App/modules/auth/dto/register.dto';
import { User } from '@App/modules/auth/entities/user.entity';
import Role from '@App/modules/auth/enums/role.enum';
import { IAuthResponse } from '@App/modules/auth/interfaces/auth-response.interface';
import { IResponse } from '@App/modules/shared/utils/response-interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { pbkdf2Sync } from 'crypto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * This's register method help in register user
   * @param {RegisterDto} registerDto
   * @returns {Promise<IResponse<IAuthResponse>>}
   */
  async register(registerDto: RegisterDto): Promise<IResponse<IAuthResponse>> {
    try {
      const user = await this.getUserByEmail(registerDto.email);
      if (user) {
        throw new BadRequestException('User already exist');
      }
      const userBody = {
        ...registerDto,
        password: await this.generateHashPassword(registerDto.password),
        role: Role.USER,
      };
      const createdUser = await this.userRepository.save(userBody);
      return <IResponse<IAuthResponse>>{
        user: {
          id: createdUser.id,
          role: createdUser.role,
          email: createdUser.email,
        },
        token: {
          accessToken: await this.generateToken(
            createdUser.id,
            createdUser.role,
          ),
          expiresIn: await this.configService.get('jwt.expiresIn'),
        },
        message: 'Successfully Registered',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * This's login method help in login user
   * @param {LoginDto} loginDto
   * @returns {Promise<IResponse<LoginResponse>>}
   */
  async login({
    password,
    ...loginDto
  }: LoginDto): Promise<IResponse<IAuthResponse>> {
    try {
      const hashedPassword = this.generateHashPassword(password);
      const user = await this.getUserByEmail(loginDto.email);
      if (!user) {
        throw new BadRequestException('Invalid Credentials');
      }

      const passwordMatch = (await hashedPassword) === user.password;
      if (!passwordMatch) {
        throw new BadRequestException('Invalid Credentials');
      }
      return <IResponse<IAuthResponse>>{
        user: { id: user.id, role: user.role, email: user.email },
        token: {
          accessToken: await this.generateToken(user.id, user.role),
          expiresIn: await this.configService.get('jwt.expiresIn'),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  private async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  /**
   * This's generateToken method help in generate token
   * @param {string} id
   * @param {string} role
   * @returns {Promise<string>}
   */
  private async generateToken(id: string, role: string): Promise<string> {
    return this.jwtService.signAsync({ sub: id, role }, { expiresIn: '1h' });
  }

  private async generateHashPassword(password: string) {
    return pbkdf2Sync(
      password,
      await this.configService.get('password.salt'),
      1000,
      64,
      'sha256',
    ).toString(`hex`);
  }
}
