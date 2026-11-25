import { Injectable, Logger } from '@nestjs/common';
import { GetUsersQueryDto } from '../dto/get-users-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Exceptions } from '../../common/exceptions/http-exceptions';
import { UserCreateManyProvider } from './user-create-many.provider';
import { Repository } from 'typeorm';
import { CreateUsersDto } from '../dto/create-users.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserCreateProvider } from './user-create.provider';
/**
 * Users Service
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  /**
   *
   * @param userRepository
   * @param userCreateManyProvider
   * @param userCreateProvider
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userCreateManyProvider: UserCreateManyProvider,
    private readonly userCreateProvider: UserCreateProvider,
  ) {}

  /**
   * Create UsersService instance
   * @param authService authentication service for verifying login status
   */

  /**
   * Create user service
   * @param createUserDto
   * @returns User
   */
  public async create(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userCreateProvider.createUser(dto);
  }
  /**
   * Create multiple users
   * @param dto
   * @returns An array of User Entity
   */
  public async createMany(dto: CreateUsersDto): Promise<UserResponseDto[]> {
    return this.userCreateManyProvider.createMany(dto);
  }

  /**
   *  Fetch all users if authenticated
   * @param getUsersQueryDto query parameter
   * @returns an array of users object
   */
  public async findAll(getUsersQueryDto: GetUsersQueryDto): Promise<User[]> {
    const users = this.userRepository.find({
      relations: {
        posts: true,
      },
    });
    return users;
  }

  /**
   * Fetch users by ID
   * @param id user ID
   * @returns user object
   */
  public async findOneById(id: number): Promise<User> {
    const result = await this.userRepository.findOneBy({ id });

    if (!result) {
      throw Exceptions.notFound('User', id);
    }

    return result;
  }

  public async findForAuthByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await this.userRepository.findOne({
      where: { email: normalizedEmail },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });
    if (!result) {
      throw Exceptions.notFound('User', email);
    }
    return result;
  }
}
