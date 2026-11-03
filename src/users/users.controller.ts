import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  Ip,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(['/', '/:id'])
  public getUsers(
    @Param('id') id?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    console.log(id);
    console.log(limit);
    console.log(offset);
    if (id) {
      return 'Called get user by id endpoint';
    }
    return 'Called get users enpoint';
  }

  @Post()
  public createUser(
    @Body() request: any, 
    @Headers() headers: any,
    @Ip() ip : any
) {
    console.log(request);
    console.log(headers);
    console.log(ip);
    return ' Called create user endpoint';
  }
}
