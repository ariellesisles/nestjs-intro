import {
  Injectable,
  forwardRef,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { PasswordService } from '../../common/security/password.service';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { randomUUID } from 'node:crypto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

// Precomputed valid bcrypt hash used only to keep response timing consistent
// when a user record does not exist.
const DUMMY_BCRYPT_HASH =
  '$2b$12$C9v8h.2mP6xL4qR1tY7wOuK3nF5gH8jL2pQ6sT9vW1xY4zA7bC0eG';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async login(dto: SignInDto): Promise<{ accessToken: string }> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userService.findForAuthByEmail(email);
    let isEqual: boolean = false;

    const hashToCompare = user?.password ?? DUMMY_BCRYPT_HASH;

    const isPasswordValid = await this.passwordService.verify(
      dto.password,
      hashToCompare,
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      jti: randomUUID(),
    } as ActiveUserData;

    // Generate Token
    const accessToken = await this.jwtService.signAsync(payload, {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.accessTokenTtl,
    });

    return {
      accessToken,
    };
  }

  public isAuthenticated() {
    return true;
  }

  public signup(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }
}
