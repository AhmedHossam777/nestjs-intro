import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider extends HashingProvider {
  async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data.toString(), salt);
  }

  async comparePassword(
    data: string | Buffer,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(data.toString(), hashed);
  }
}