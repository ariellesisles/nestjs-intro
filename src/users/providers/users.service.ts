import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GetUsersQueryDto } from '../dto/get-users-query.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { Exceptions } from '../../common/exceptions/http-exceptions';
import { isUniqueViolation } from '../../common/exceptions/database-errors';
import { PasswordService } from '../../common/security/password.service';
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
    private readonly configService: ConfigService,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * Mock user list data
   */
  users = [
    { fistName: 'John', email: 'John@gmail.com' },
    { fistName: 'Jane', email: 'Jane@gmail.com' },
    { fistName: 'Alice', email: 'Alice@gmail.com' },
  ];

  /**
   * Create UsersService instance
   * @param authService authentication service for verifying login status
   */

  /**
   * Create user service
   * @param createUserDto
   * @returns User
   */
  public async create(dto: CreateUserDto): Promise<User> {
    const email = dto.email.trim().toLowerCase();

    // 1. UX pre-check — NOT for correctness (DB constraint is the guard)
    const existing = await this.userRepository.findOne({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      throw Exceptions.uniqueConflict('email');
    }

    // 2. Insert — named DB constraint is the source of truth
    try {
      const user = this.userRepository.create({
        ...dto,
        email,
        password: await this.passwordService.hash(dto.password),
      });
      return await this.userRepository.save(user);
    } catch (err: unknown) {
      if (err instanceof HttpException) throw err;

      if (isUniqueViolation(err, 'UQ_users_email')) {
        throw Exceptions.uniqueConflict('email');
      }

      this.logger.error(
        'Unexpected error creating user',
        err instanceof Error ? err.stack : String(err),
      );
      throw Exceptions.unexpected();
    }
  }

  /**
   *  Fetch all users if authenticated
   * @param getUsersQueryDto query parameter
   * @returns an array of users object
   */
  public findAll(getUsersQueryDto: GetUsersQueryDto) {
    console.log('APP_VERSION:', this.configService.get<string>('APP_VERSION'));
    console.log('profileConfig:', this.profileConfiguration);
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('isAuthenticated', isAuthenticated);
    if (isAuthenticated) {
      return [...this.users];
    }
  }

  /**
   * Fetch users by ID
   * @param id user ID
   * @returns user object
   */
  public async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
