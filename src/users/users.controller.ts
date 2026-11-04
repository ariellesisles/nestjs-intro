import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserParamsDto } from './dto/get-user-params.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

@Controller('users')
export class UsersController {
  @Get()
  public getUsers(@Query() getUsersQueryDto: GetUsersQueryDto) {
    console.log(getUsersQueryDto);
    return 'Called get users enpoint';
  }

  @Get(':id')
  public getUser(@Param() getUserParamsDto: GetUserParamsDto) {
    console.log(getUserParamsDto);
    return 'Called get user endpoint';
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto instanceof CreateUserDto);
    return ' Called create user endpoint';
  }
}
