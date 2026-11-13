import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrpyt from 'bcrypt';
@Injectable()
export class PasswordService {
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
    return bcrpyt.hash(password, this.cost);
  }

  /**
   * Compare plaintext password to hash Password
   * @param password plaintext password
   * @param hashPassword stored bcrypt password
   * @returns true if they match
   */
  verify(password: string, hashPassword: string): Promise<boolean> {
    return bcrpyt.compare(password, hashPassword);
  }
}
