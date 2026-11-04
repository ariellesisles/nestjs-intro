import { Controller, Get } from '@nestjs/common';
import { PostsService } from '../providers/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public getPosts() {
    return 'Get posts endpoint';
  }
}
