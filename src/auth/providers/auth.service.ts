import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignInProvider } from './sign-in.provider';
import { AuthTokens } from '../interfaces/auth-tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly signinProvider: SignInProvider,
  ) {}

  public async signin(dto: SignInDto): Promise<AuthTokens> {
    return this.signinProvider.signIn(dto);
  }

  public signup(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }
}
