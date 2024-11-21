import { User } from '@App/modules/auth/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class EmailExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async validate(email: string, _args: ValidationArguments): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    return !!user;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Email does not exist';
  }
}
