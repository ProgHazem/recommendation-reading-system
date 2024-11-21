import { IUserResponse } from '@App/modules/auth/interfaces/user-response.interface';

export interface IAuthResponse {
  user: IUserResponse;
  token: {
    accessToken: string;
    expiresIn: string;
  };
}
