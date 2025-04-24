import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../../meta-option/entities/meta-option.entity';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../../tag/entities/tag.entity';
import { TagService } from '../../tag/tag.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    private readonly tagsService: TagService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    const { authorId, tagsIds } = createPostDto;
    const author = await this.usersService.findOneById(authorId);
    const tags = await this.tagsService.findMany(tagsIds);

    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
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

  public async update(postId: number, patchPostDto: PatchPostDto) {
    const { tagsIds } = patchPostDto;
    const tags = await this.tagsService.findMany(tagsIds);

    const post = await this.postRepository.findOneBy({
      id: postId,
    });

    post.tags = tags;
    post.title = patchPostDto.title;
    post.content = patchPostDto.content;
    post.slug = patchPostDto.slug;
    post.status = patchPostDto.status;
    post.postType = patchPostDto.postType;
    post.featuredImageUrl = patchPostDto.featuredImageUrl;
    post.schema = patchPostDto.schema;

    return await this.postRepository.save(post);
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