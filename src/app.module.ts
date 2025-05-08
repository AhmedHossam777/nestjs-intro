import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TagModule } from './tag/tag.module';
import { MetaOptionModule } from './meta-option/meta-option.module';

// Configurations for the application
import { ConfigModule, ConfigService } from './config';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PaginationModule } from './common/pagination/pagination.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuardGuard } from './auth/guards/access-token.guard/access-token.guard.guard';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagModule,
    MetaOptionModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: configService.database.port,
        host: configService.database.host,
        username: configService.database.username,
        password: configService.database.password,
        database: configService.database.database,
        synchronize: configService.database.synchronize,
        autoLoadEntities: configService.database.autoLoadEntities,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuardGuard,
    },
  ],
})
export class AppModule {}