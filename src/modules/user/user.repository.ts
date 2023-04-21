import { UserEntity } from 'src/models/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findUserByUserId(userId: number): Promise<UserEntity> {
    const user = await this.createQueryBuilder('users').select('*').where('users.id = :userId', { userId }).execute();
    if (user[0]) {
      return user[0];
    } else return null;
  }
}
