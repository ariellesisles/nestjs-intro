import {
  Injectable,
  forwardRef,
  Inject,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { PasswordService } from '../../common/security/password.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
  ) {}

  public async login(dto: SignInDto) {
    const { password, email } = dto;

    let isEqual: boolean = false;

    const user = await this.userService.getPasswordByEmail(email);
    console.log('user', user);
    try {
      isEqual = await this.passwordService.verify(password, user.password);
    } catch (err) {
      throw new RequestTimeoutException(err, {
        description: 'Password Could not match',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Invalid Username or password');
    }
    return isEqual;
  }

  public isAuthenticated() {
    return true;
  }

  public signup(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }
}
