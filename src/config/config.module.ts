import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { configValidationSchema } from './config.validation';
import configuration from './configurations';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      validationSchema: configValidationSchema,
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}