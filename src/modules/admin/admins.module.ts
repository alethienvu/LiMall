import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/modules/auth/auth.constants';
import { MailModule } from 'src/modules/mail/mail.module';
import { AdminController } from './admins.controller';
import { AdminService } from './admins.service';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    Logger,
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: jwtConstants.accessTokenExpiry },
    }),
    MailModule,
    UsersModule,
  ],
  providers: [AdminService, Logger],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminsModule {}
