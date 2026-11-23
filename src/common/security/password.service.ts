import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  private readonly cost: number;

  /**
   *
   * @param config
   */
  constructor(config: ConfigService) {
    this.cost = Number(config.get('BCRYPT_COST') ?? 12);
  }

  /**
   * Hash a plaintext password
   * @param password plain text password
   * @returns A string of hash password
   */
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.cost);
  }

  /**
   * Compare plaintext password to hash Password
   * @param password plaintext password
   * @param hashPassword stored bcrypt password
   * @returns true if they match
   */
  public async verify(
    password: string,
    hashPassword: string | null | undefined,
  ): Promise<boolean> {
    if (!hashPassword) {
      return false;
    }

    try {
      return await bcrypt.compare(password, hashPassword);
    } catch (err) {
      this.logger.error(
        'Failed to verify password hash',
        err instanceof Error ? err.stack : undefined,
      );
      return false;
    }
  }
}
