import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../../meta-option/entities/meta-option.entity';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);

    // Save and return post
    return await this.postRepository.save(post);
  }

  public async findAll() {
    return await this.postRepository.find();
  }

  public async findOne(postId: number) {
    return await this.postRepository.findOneBy({
      id: postId,
    });
  }

  public async deleteOne(postId: number) {
    // find the post

    const post = await this.postRepository.findOneBy({
      id: postId,
    });
    // delete the post

    await this.postRepository.delete(postId);
    // delete the related metaOptions

    // await this.metaOptionsRepository.delete(post.metaOptions.id);
    // confirmation

    return {
      deleted: true,
      id: postId,
    };
  }
}