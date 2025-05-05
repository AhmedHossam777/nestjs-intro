import { Config } from './config.interface';

export default (): Config => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'database',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refreshSecret',
    expiresIn: parseInt(process.env.JWT_TOKEN_TTL, 10) || 3600,
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_TTL, 10) || 86400,
    tokenAudience: process.env.JWT_TOKEN_AUDIENCE || 'audience',
    tokenIssuer: process.env.JWT_TOKEN_ISSUER,
  },
});