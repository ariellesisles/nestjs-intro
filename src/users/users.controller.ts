import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(['/', '/:id'])
  public getUsers(
    @Param('id') id?: number | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('page', ParseIntPipe, new DefaultValuePipe(1)) page?: number,
  ) {
    console.log({ id, limit, page });
    if (id) {
      return 'Called get user by id endpoint';
    }
    return 'Called get users enpoint';
  }

  @Post()
  public createUser(
    @Body() request: any,
    @Headers() headers: any,
    @Ip() ip: any,
  ) {
    console.log(request);
    console.log(headers);
    console.log(ip);
    return ' Called create user endpoint';
  }
}
