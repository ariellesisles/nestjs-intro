import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordService } from '../common/security/password.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService, GenerateTokensProvider, SignInProvider, RefreshTokensProvider],
  exports: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
