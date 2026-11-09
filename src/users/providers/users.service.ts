import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersQueryDto } from '../dto/get-users-query.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

/**
 * Users Service
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
   *  Fetch all users if authenticated
   * @param getUsersQueryDto query parameter
   * @returns an array of users object
   */
  public findAll(getUsersQueryDto: GetUsersQueryDto) {
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
