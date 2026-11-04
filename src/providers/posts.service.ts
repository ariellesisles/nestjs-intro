import { Injectable } from '@nestjs/common';

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
}
