import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { Exceptions } from '../../common/exceptions/http-exceptions';
import { CreateUsersDto } from '../dto/create-users.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { PasswordService } from '../../common/security/password.service';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserCreateManyProvider {
  private readonly logger = new Logger(UserCreateManyProvider.name);

  constructor(
    private readonly datasource: DataSource,
    private readonly passwordService: PasswordService,
  ) {}

  public async createMany(dto: CreateUsersDto): Promise<UserResponseDto[]> {
    const users = dto.users;

    if (!users?.length) {
      return [];
    }

    try {
      return await this.datasource.transaction(async (manager) => {
        const normalizedDtos = await Promise.all(
          users.map(async (dto: CreateUserDto) => ({
            ...dto,
            email: dto.email.trim().toLowerCase(),
            password: await this.passwordService.hash(dto.password),
          })),
        );
        // 1. Check duplicates within the incoming batch itself
        const seenInBatch = new Set<string>();
        const batchDuplicates = new Set<string>();

        for (const item of normalizedDtos) {
          if (seenInBatch.has(item.email)) {
            batchDuplicates.add(item.email);
          }
          seenInBatch.add(item.email);
        }

        if (batchDuplicates.size > 0) {
          throw new ConflictException({
            statusCode: 409,
            error: 'Conflict',
            message: `Duplicate emails in request: ${[...batchDuplicates].join(', ')}`,
            code: 'DUPLICATE_IN_BATCH',
            conflicts: [...batchDuplicates],
          });
        }

        // 2. Create & save atomically
        const entities = normalizedDtos.map((dto) => manager.create(User, dto));
        const savedUsers = await manager.save(User, entities);

        return savedUsers.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }));
      });
    } catch (err) {
      this.logger.error(
        `createMany failed: ${Exceptions.getErrorDetails(err)}`,
      );
      throw Exceptions.toHttpException(err, 'User');
    }
  }
}
