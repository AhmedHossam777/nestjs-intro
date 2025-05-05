import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config } from './config.interface';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService<Config>) {}

  get app(): Config['app'] {
    return this.configService.get('app');
  }

  get database(): Config['database'] {
    return this.configService.get('database');
  }

  get jwt(): Config['jwt'] {
    return this.configService.get('jwt');
  }
}