import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  public signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Auth(AuthType.None)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public login(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @Auth(AuthType.None)
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  public refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken);
  }
}
