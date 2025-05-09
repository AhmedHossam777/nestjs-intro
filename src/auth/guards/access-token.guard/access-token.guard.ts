import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenProvider } from '../../providers/token.provider';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenProvider: TokenProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request object from the context
    const request = context.switchToHttp().getRequest();
    // extract the token from the request headers
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // validate the token
    const token: string = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    const payload = await this.tokenProvider.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    request['user'] = payload;

    console.log('payload : ', payload);
    return true;
  }
}