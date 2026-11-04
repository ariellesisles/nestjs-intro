import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserParamsDto } from './dto/get-user-params.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getUsers(@Query() getUsersQueryDto: GetUsersQueryDto) {
    console.log(getUsersQueryDto);
    return this.usersService.findAll(getUsersQueryDto);
  }

  @Get(':id')
  public getUser(@Param() getUserParamsDto: GetUserParamsDto) {
    console.log(getUserParamsDto);
    return this.usersService.findOneById(getUserParamsDto.id);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto instanceof CreateUserDto);
    return ' Called create user endpoint';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'Called patch user endpoint';
  }
}
