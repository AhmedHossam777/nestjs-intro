import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interface/token-payload.interface';

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
    return this.jwtService.signAsync({ userId, email } as TokenPayload, {
      secret: this.configService.jwt.secret,
      expiresIn: this.configService.jwt.expiresIn,
      issuer: this.configService.jwt.tokenIssuer,
      audience: this.configService.jwt.tokenAudience,
    });
  }

  public async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.jwt.secret,
        issuer: this.configService.jwt.tokenIssuer,
        audience: this.configService.jwt.tokenAudience,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}