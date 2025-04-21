import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TagModule } from './tag/tag.module';
import { MetaOptionModule } from './meta-option/meta-option.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagModule,
    MetaOptionModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        // entities: [__dirname + '/**/*.entity{.ts],.js}'],
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        host: 'localhost',
        database: 'postgres',
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}