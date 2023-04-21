import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/models/entities/user.entity';
import { jwtConstants } from 'src/modules/auth/auth.constants';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { UserService } from 'src/modules/user/users.service';
import { UserStatus } from 'src/shares/enums/user.enum';
import { ERROR_MESSAGE_CODE } from 'src/shares/constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userService.findUserById(payload.userId);
    if (!user) {
      throw new HttpException(ERROR_MESSAGE_CODE.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (user.status == UserStatus.LOCKED) {
      throw new HttpException(ERROR_MESSAGE_CODE.LOCKED_USER, HttpStatus.FORBIDDEN);
    }

    return user;
  }
}
