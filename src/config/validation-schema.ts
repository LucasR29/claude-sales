import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1d'),
  ADMIN_EMAIL: Joi.string().email().required(),
  RESET_PASSWORD_EXPIRATION: Joi.string().default('10m'),
}); 