import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MetaOptionModule } from '../meta-option/meta-option.module';
import { MetaOption } from '../meta-option/entities/meta-option.entity';
import { TagModule } from '../tag/tag.module';
import { PaginationModule } from '../common/pagination/pagination.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    UsersModule,
    MetaOptionModule,
    TagModule,
    TypeOrmModule.forFeature([Post, MetaOption]),
    PaginationModule,
  ],
})
export class PostsModule {}