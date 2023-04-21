import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { ERROR_MESSAGE_CODE } from 'src/shares/constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const superResult = await super.canActivate(context);
    if (!superResult) {
      return false;
    }
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization;
      const payload: JwtPayload = jwtDecode(token);
      console.log('🚀🚀🚀 ~ JwtAuthGuard ~ payload:', payload);
      return true;
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE_CODE.UNAUTHORIZED, HttpStatus.BAD_REQUEST);
    }
  }
}
