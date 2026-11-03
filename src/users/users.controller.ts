import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(['/', '/:id'])
  public getUsers(
    @Param('id') id?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    if (id) {
      return 'Called get user by id endpoint';
    }
    return 'Called get users enpoint';
  }

  @Post()
  public createUser(@Req() request: Request) {
    console.log(request);
    return ' Called create user endpoint';
  }
}
