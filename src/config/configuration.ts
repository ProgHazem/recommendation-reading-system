export interface Configuration {
  app: AppSettings;
  postgresDatabase: PostgresDatabase;
  jwt: JwtSettings;
  password: PasswordSettings;
}

export interface AppSettings {
  env: string;
  port: number;
}

export interface PostgresDatabase {
  host: string;
  name?: string;
  database: string;
  username: string;
  password: string;
  port: number;
  ssl: boolean | PostgresDatabaseSSL;
}

export interface JwtSettings {
  jwtSecret: string;
  algorithm: Algorithm;
  expiresIn: string;
}

export type Algorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none';

export interface PasswordSettings {
  salt: string;
}

export interface PostgresDatabaseSSL {
  rejectUnauthorized: boolean;
  ca: string;
  cert: string;
  key: string;
}

export const configuration = (): Configuration => ({
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  postgresDatabase: {
    host: process.env.POSTGRES_HOST as string,
    database: process.env.POSTGRES_DATABASE as string,
    username: process.env.POSTGRES_USERNAME as string,
    password: process.env.POSTGRES_PASSWORD as string,
    port: parseInt(process.env.POSTGRES_PORT as string),
    ssl:
      process.env.SSL && process.env.SSL == 'true'
        ? {
            rejectUnauthorized:
              process.env.REJECT_UNAUTHORIZED &&
              process.env.REJECT_UNAUTHORIZED == 'true',
            ca: process.env.CA,
            cert: process.env.CERT,
            key: process.env.KEY,
          }
        : false,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET as string,
    algorithm: process.env.JWT_ALGORITHM as Algorithm,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  },
  password: {
    salt: process.env.PASSWORD_SALT as string,
  },
});
