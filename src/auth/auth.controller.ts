import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './providers/dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  public async signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: SignInDto) {
    return await this.authService.login(dto);
  }
}
