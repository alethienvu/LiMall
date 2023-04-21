import { UserRole } from 'src/shares/enums/user.enum';

export class JwtPayload {
  userId: number;
  role: UserRole;
}
