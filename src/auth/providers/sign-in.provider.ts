import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { PasswordService } from '../../common/security/password.service';
import { UsersService } from '../../users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { AuthTokens } from '../interfaces/auth-tokens.interface';

// Precomputed valid bcrypt hash used only to keep response timing consistent
// when a user record does not exist.
const DUMMY_BCRYPT_HASH =
  '$2b$12$C9v8h.2mP6xL4qR1tY7wOuK3nF5gH8jL2pQ6sT9vW1xY4zA7bC0eG';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly usersService: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(dto: SignInDto): Promise<AuthTokens> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.usersService.findForAuthByEmail(email);

    const hashToCompare = user?.password ?? DUMMY_BCRYPT_HASH;

    const isPasswordValid = await this.passwordService.verify(
      dto.password,
      hashToCompare,
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokensProvider.generateTokens(user);
  }
}
