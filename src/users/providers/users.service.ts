import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GetUsersQueryDto } from '../dto/get-users-query.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import profileConfig from '../config/profile.config';
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
   * Inject AuthService and UserRepository
   * @param authService
   * @param userRepository
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(profileConfig.KEY)
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
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      const users = this.userRepository.find({
        relations: {
          posts: true,
        },
      });
      return users;
    } else {
      throw new UnauthorizedException(
        `Access Denied. Please check credentials`,
      );
    }
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

  public async getPasswordByEmail(email: string) {
    const result = await this.userRepository.findOne({
      where: { email },
      select: {
        password: true,
      },
    });
    if (!result) {
      throw Exceptions.notFound('User', email);
    }
    return result;
  }
}
