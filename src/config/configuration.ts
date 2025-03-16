export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    name: process.env.DATABASE_NAME || 'sales_management',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '1d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
  },
  resetPassword: {
    expiresIn: process.env.RESET_PASSWORD_EXPIRATION || '10m',
  },
}); 