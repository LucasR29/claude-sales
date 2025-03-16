# Instalar NestJS CLI
npm i -g @nestjs/cli

# Criar novo projeto
nest new sales-management-api

# Entrar no diretório do projeto
cd sales-management-api

# Instalar dependências necessárias
npm install --save @nestjs/typeorm typeorm pg
npm install --save @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
npm install --save bcrypt class-validator class-transformer
npm install --save @nestjs/config joi
npm install --save @nestjs/swagger swagger-ui-express
npm install --save argon2
npm install --save nodemailer

# Instalar dependências de desenvolvimento
npm install --save-dev @types/passport-jwt @types/passport-local @types/bcrypt @types/nodemailer 