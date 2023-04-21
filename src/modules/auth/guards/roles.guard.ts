import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRole } from 'src/shares/enums/user.enum';
import { ERROR_MESSAGE_CODE } from 'src/shares/constant';
import { JwtPayload } from '../strategies/jwt.payload';
import jwtDecode from 'jwt-decode';

@Injectable()
export class OnlyAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    const payload: JwtPayload = jwtDecode(token);
    const { role } = payload;
    if (role === UserRole.ADMIN) return true;
    else throw new HttpException(ERROR_MESSAGE_CODE.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}

@Injectable()
export class OnlySuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    const payload: JwtPayload = jwtDecode(token);
    const { role } = payload;
    if (role === UserRole.SUPER_ADMIN) return true;
    else throw new HttpException(ERROR_MESSAGE_CODE.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}

@Injectable()
export class AdminAndSuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    const payload: JwtPayload = jwtDecode(token);
    const { role } = payload;
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) return true;
    else throw new HttpException(ERROR_MESSAGE_CODE.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}
