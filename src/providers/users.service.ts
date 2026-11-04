import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersQueryDto } from '../users/dto/get-users-query.dto';
import { AuthService } from '../auth/providers/auth.service';

@Injectable()
export class UsersService {
  users = [
    { fistName: 'John', email: 'John@gmail.com' },
    { fistName: 'Jane', email: 'Jane@gmail.com' },
    { fistName: 'Alice', email: 'Alice@gmail.com' },
  ];

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll(getUsersQueryDto: GetUsersQueryDto) {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('isAuthenticated', isAuthenticated);
    if (isAuthenticated) {
      return [...this.users];
    }
  }

  public findOneById(id: number) {
    return { fistName: 'John', email: 'John@gmail.com' };
  }
}
