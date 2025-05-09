import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQ_USER_KEY } from '../constants/auth.constant';
import { TokenPayload } from '../interface/token-payload.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof TokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const activeUserPayload: TokenPayload = request[REQ_USER_KEY];

    return field ? activeUserPayload?.[field] : activeUserPayload;
  },
);