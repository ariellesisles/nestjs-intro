import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get posts by user' })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user',
    type: 'string',
    example: '12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Posts successfully retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  public getPostsById(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'Post successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request / Validation failed',
  })
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Patch()
  @ApiOperation({
    summary: 'Patch blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'Update blog successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request / Validation failed',
  })
  public patchPost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.patchPost(patchPostDto);
  }
}
