import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token.guard/access-token.guard';
import { AuthType } from '../../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../constants/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: (): boolean => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get authType from reflector class
    const authTypes: AuthType[] = this.reflector.getAllAndOverride(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];
    // create array of guards : this will contains guard for each of auth types
    const guards = authTypes
      .map((authType) => this.authTypeGuardMap[authType])
      .flat();
    // loop through this array of guards and fire canActivate method
    for (const guard of guards) {
      const canActivate = await Promise.resolve(
        guard.canActivate(context),
      ).catch((err) => {
        console.error(err);
        return false; // Return false on error
      });

      if (canActivate) {
        return true;
      }
    }
    throw new UnauthorizedException();
  }
}