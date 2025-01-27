import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './presentation/modules/auth.module';
import { UserModule } from './presentation/modules/user.module';
import { AdminModule } from './presentation/modules/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './presentation/Guard/auth.guard';
import { AuthorizationGuard } from './presentation/Guard/authorization.guard';
import { LoggerMiddleware } from './presentation/middleware/logger.middleware';
import { User } from './domain/Models/user.model';
import { Admin } from './domain/Models/admin.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.HOST,
      port: 5432,
      username: process.env.ADMIN_NAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [User, Admin],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
