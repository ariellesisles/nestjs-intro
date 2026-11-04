import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserParamsDto } from './dto/get-user-params.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { PatchUserDto } from './dto/patch-user.dto';

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

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto){
    console.log(patchUserDto);
    return "Called patch user endpoint"
  }
}
