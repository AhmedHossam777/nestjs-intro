import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../../meta-option/entities/meta-option.entity';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagService } from '../../tag/tag.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { PaginatedInterface } from '../../common/pagination/interfaces/paginated.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    private readonly tagsService: TagService,

    private readonly paginationProvider: PaginationProvider,

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

  public async findAll(
    postQuery: GetPostsDto,
  ): Promise<PaginatedInterface<Post>> {
    return await this.paginationProvider.paginateQuery(
      postQuery,
      this.postRepository,
    );
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
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.slug = patchPostDto.slug ?? post.slug;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.schema = patchPostDto.schema ?? post.schema;

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