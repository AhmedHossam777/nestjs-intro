import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { Request } from 'express';
import { REQ_USER_KEY } from '../auth/constants/auth.constant';
import { ActiveUser } from '../auth/decorators/acitve-user.decorator';
import { TokenPayload } from '../auth/interface/token-payload.interface';

@Controller('api/posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    /*
     *  Injecting Posts Service
     */
    private readonly postsService: PostsService,
  ) {}

  // /*
  //  * GET localhost:3000/posts/:userId
  //  */
  // @Get('/:userId?')
  // public getPosts(@Param('userId') userId: string) {
  //   return this.postsService.findAll(userId);
  // }

  @Get()
  public getAllPosts(@Query() postQuery: GetPostsDto) {
    return this.postsService.findAll(postQuery);
  }

  @Get(':id')
  public async getOnePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  @Post()
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() activeUser: TokenPayload,
  ) {
    return this.postsService.create(createPostDto, activeUser);
  }

  @ApiOperation({
    summary: 'Updates an existing blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the post is updated successfully',
  })
  @Patch(':id')
  public updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchPostsDto: PatchPostDto,
  ) {
    return this.postsService.update(id, patchPostsDto);
  }

  @ApiOperation({
    summary: 'Deletes an existing blog post',
  })
  @ApiResponse({
    status: 204,
    description: 'A 204 response if the post is deleted successfully',
  })
  @Delete(':id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deleteOne(id);
  }
}