import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async generateAccessToken(
    userId: number,
    email: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { userId, email },
      {
        secret: this.configService.jwt.secret,
        expiresIn: this.configService.jwt.expiresIn,
        issuer: this.configService.jwt.tokenIssuer,
        audience: this.configService.jwt.tokenAudience,
      },
    );
  }
}