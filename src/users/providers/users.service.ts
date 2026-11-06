import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersQueryDto } from '../dto/get-users-query.dto';
import { AuthService } from '../../auth/providers/auth.service';

/**
 * Users Service
 */
@Injectable()
export class UsersService {
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
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

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
  public findOneById(id: number) {
    return { fistName: 'John', email: 'John@gmail.com' };
  }
}
