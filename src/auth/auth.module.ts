import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { ConfigModule, ConfigService } from '../config';
import { JwtModule } from '@nestjs/jwt';
import { TokenProvider } from './providers/token.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    TokenProvider,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwt.secret,
        signOptions: {
          expiresIn: configService.jwt.expiresIn,
          issuer: configService.jwt.tokenIssuer,
          audience: configService.jwt.tokenAudience,
        },
      }),
    }),
  ],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}