import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

/**
 * Post Controller
 */
@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  /**
   * Inject PostsServiceS
   * @param postsService
   */
  constructor(private readonly postsService: PostsService) {}

  /**
   * Find post by ID
   * @param id
   * @returns post object
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get posts by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the post',
    type: 'string',
    example: '12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Posts successfully retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  public getPostsById(@Param('id') id: number) {
    return this.postsService.findPostById(id);
  }

  /**
   * Create Post
   * @param createPostDto
   * @returns Post
   */
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
    return this.postsService.create(createPostDto);
  }

  /**
   * Patch Post
   * @param patchPostDto
   * @returns post
   */
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
