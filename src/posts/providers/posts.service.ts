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
    const { authorId } = createPostDto;
    const author = await this.usersService.findOneById(authorId);

    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
    });

    return await this.postRepository.save(post);
  }

  public async findAll() {
    return await this.postRepository.find({
      relations: {
        metaOptions: true,
        // author: true,
      },
    });
  }

  public async findOne(postId: number) {
    return await this.postRepository.findOneBy({
      id: postId,
    });
  }

  public async deleteOne(postId: number) {
    // find the post WITH relations loaded
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['metaOptions'],
    });

    if (!post) {
      return {
        deleted: false,
        id: postId,
        message: 'Post not found',
      };
    }

    await this.postRepository.remove(post);

    return {
      deleted: true,
      id: postId,
    };
  }
}