import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  public findAll(userId: string) {
    console.log(userId);
    return [
      {
        title: 'Test Title',
        content: 'Content',
      },

      {
        title: 'Test Title1 ',
        content: 'Content 1',
      },
    ];
  }

  public createPost(createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return ' Create post endpoint';
  }
}
