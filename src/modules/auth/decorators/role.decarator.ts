import Role from '@App/modules/auth/enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES = 'roles';
export const UserRolesDecorator = (...roles: Role[]) =>
  SetMetadata(ROLES, roles);
