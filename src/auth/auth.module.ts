import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordService } from '../common/security/password.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  exports: [AuthService],
  imports: [forwardRef(() => UsersModule)],
})
export class AuthModule {}
