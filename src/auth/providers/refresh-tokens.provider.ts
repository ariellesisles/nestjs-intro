import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from '../../users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { AuthTokens } from '../interfaces/auth-tokens.interface';
import { Exceptions } from '../../common/exceptions/http-exceptions';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly usersService: UsersService,
  ) {}

  public async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthTokens> {
    try {
      const { refreshToken } = refreshTokenDto;

      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersService.findOneById(sub);

      return await this.generateTokensProvider.generateTokens(user);
    } catch (err) {
      throw Exceptions.toHttpException(err);
    }
  }
}
