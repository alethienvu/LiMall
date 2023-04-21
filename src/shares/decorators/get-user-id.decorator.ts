import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { ERROR_MESSAGE_CODE } from 'src/shares/constant';
/**
 * This decorator get userId from headers
 */
export const UserID = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  try {
    const token = request.headers.authorization;
    const payload: JwtPayload = jwtDecode(token);
    return payload.userId;
  } catch (e) {
    throw new HttpException(ERROR_MESSAGE_CODE.UNAUTHORIZED, HttpStatus.BAD_REQUEST);
  }
});
