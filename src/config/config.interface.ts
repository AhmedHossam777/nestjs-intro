export interface AppConfig {
  port: number;
  env: string;
  apiVersion: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
}

export interface JwtConfig {
  secret: string;
  refreshSecret: string;
  expiresIn: number;
  refreshExpiresIn: number;
  tokenAudience: string;
  tokenIssuer: string;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
}