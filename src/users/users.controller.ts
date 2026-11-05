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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully',
  })
  public getUsers(@Query() getUsersQueryDto: GetUsersQueryDto) {
    console.log(getUsersQueryDto);
    return this.usersService.findAll(getUsersQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  public getUser(@Param() getUserParamsDto: GetUserParamsDto) {
    console.log(getUserParamsDto);
    return this.usersService.findOneById(getUserParamsDto.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request / Validation failed' })
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto instanceof CreateUserDto);
    return 'Called create user endpoint';
  }

  @Patch()
  @ApiOperation({
    summary: 'Patch user details',
    description:
      'Partially updates an existing user record with the provided payload fields.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: PatchUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request / Validation failed' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'Called patch user endpoint';
  }
}
