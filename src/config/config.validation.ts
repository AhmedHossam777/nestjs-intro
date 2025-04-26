import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // app configurations validation
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_VERSION: Joi.string().default('v1'),

  // database configurations validation
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().required(),
  DATABASE_AUTO_LOAD_ENTITIES: Joi.boolean().required(),

  // jwt configurations validation
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.number().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
});