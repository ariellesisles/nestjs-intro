import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { PasswordService } from '../common/security/password.service';
import { UserCreateManyProvider } from './providers/user-create-many.provider';
import { UserCreateProvider } from './providers/user-create.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PasswordService,
    UserCreateManyProvider,
    UserCreateProvider,
  ],
  exports: [UsersService, PasswordService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
