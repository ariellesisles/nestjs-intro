import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { Exceptions } from '../../common/exceptions/http-exceptions';
import { PasswordService } from '../../common/security/password.service';
import { isUniqueViolation } from '../../common/exceptions/database-errors';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Create User Provider
 */
@Injectable()
export class UserCreateProvider {
  private readonly logger = new Logger(UserCreateProvider.name);
  /**
   * Inject User Repository and PasswordService
   * @param userRepository
   * @param passwordService
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * A method to create user
   * @param dto
   * @returns  A UserResponseDto object
   */
  public async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    const email = dto.email.trim().toLowerCase();

    // 1. UX pre-check — NOT for correctness (DB constraint is the guard)
    const existing = await this.userRepository.findOne({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      throw Exceptions.uniqueConflict('email');
    }

    // 2. Insert — named DB constraint is the source of truth
    try {
      const user = this.userRepository.create({
        ...dto,
        email,
        password: await this.passwordService.hash(dto.password),
      });
      const savedUser = await this.userRepository.save(user);

      return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      };
    } catch (err: unknown) {
      if (err instanceof HttpException) throw err;

      if (isUniqueViolation(err, 'UQ_users_email')) {
        throw Exceptions.uniqueConflict('email');
      }
      this.logger.error(
        `create user failed: ${Exceptions.getErrorDetails(err)}`,
      );
      throw Exceptions.toHttpException(err, 'User');
    }
  }
}
