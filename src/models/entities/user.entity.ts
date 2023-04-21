import { Exclude, Expose, Transform } from 'class-transformer';
import { UserRole, UserStatus } from 'src/shares/enums/user.enum';
import { dateTransformer } from 'src/shares/helpers/transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column()
  @Expose()
  address: string;

  @Column({
    nullable: true,
  })
  @Expose()
  first_name: string;

  @Column({
    nullable: true,
  })
  @Expose()
  last_name: string;

  @Column({
    nullable: false,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn()
  @Transform(dateTransformer)
  createdAt: Date;

  @UpdateDateColumn()
  @Transform(dateTransformer)
  updatedAt: Date;
}
