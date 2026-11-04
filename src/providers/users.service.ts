import { Injectable } from '@nestjs/common';
import { GetUsersQueryDto } from '../users/dto/get-users-query.dto';

@Injectable()
export class UsersService {
  public findAll(getUsersQueryDto: GetUsersQueryDto) {
    return [
      { fistName: 'John', email: 'John@gmail.com' },
      { fistName: 'Jane', email: 'Jane@gmail.com' },
      { fistName: 'Alice', email: 'Alice@gmail.com' },
    ];
  }

  public findOneById(id: number) {
    return { fistName: 'John', email: 'John@gmail.com' };
  }
}
