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

/**
 * Users Controller
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  /**
   * Creates an instance of UsersController.
   * @param {UsersService} usersService - Service handling user data operations.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves paginated or filtered list of users based on query parameters
   * @param {GetUsersQueryDto} getUsersQueryDto - Query filters, pagination for fetch users
   * @returns {Promise<User[]> | User[]} An array of user objects matching the criteria.
   * @throws {BadRequestException} When query parameters fail validation.
   */
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

  /**
   * Retrieves a single user profile by their unique identifier.
   *
   * @async
   * @param {GetUserParamsDto} getUserParamsDto - Path parameters containing the target user's ID.
   * @returns {Promise<User> | User} The matching user object.
   * @throws {NotFoundException} When the user with the specified ID does not exist.
   */
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

  /**
   * Creates a new user record in the system using the provided payload.
   *
   * @async
   * @param {CreateUserDto} createUserDto - Data transfer object containing the new user's details.
   * @returns {string | User} A success message or the newly created user object.
   * @throws {BadRequestException} When required body fields are missing or invalid.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request / Validation failed' })
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Partially updates an existing user record with the provided payload fields.
   *
   * @async
   * @param {PatchUserDto} patchUserDto - Data transfer object containing fields to update.
   * @returns {string | User} A success message or the updated user object.
   * @throws {BadRequestException} When validation fails.
   * @throws {NotFoundException} When the target user cannot be found.
   */
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
