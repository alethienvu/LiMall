import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserRepository } from 'src/models/repositories/user.repository';
import { CreateUserDto } from 'src/modules/user/type/createUser.dto';
import { UserRole } from 'src/shares/enums/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { UpdateUserDto } from './type/updateUser.dto';

@Injectable()
export class UserService {
  private web3;

  constructor(
    @InjectRepository(UserRepository, 'master') private usersRepositoryMaster: UserRepository,
    @InjectRepository(UserRepository, 'report') private usersRepositoryReport: UserRepository,
  ) {}

  async checkUserIdExisted(id: number): Promise<boolean> {
    const user = await this.usersRepositoryReport.findOne({
      id: id,
    });
    if (user) return true;
    else return false;
  }

  async checkUserEmailAddressExisted(email: string): Promise<boolean> {
    const user = await this.usersRepositoryReport.findOne({
      where: {
        email: email,
      },
      select: ['id'],
    });
    return !!user;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.usersRepositoryReport.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new HttpException(httpErrors.ACCOUNT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findUserByEmailAddress(email: string): Promise<UserEntity> {
    const user = await this.usersRepositoryReport.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException(httpErrors.ACCOUNT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  @Transaction({ connectionName: 'master' })
  async createUser(
    createUserDto: CreateUserDto,
    @TransactionRepository(UserEntity) transactionRepositoryUser?: Repository<UserEntity>,
  ): Promise<UserEntity> {
    const { email, password } = createUserDto;

    const sameEmailAddress = await this.checkUserEmailAddressExisted(email);
    if (!!sameEmailAddress) {
      throw new HttpException(httpErrors.ACCOUNT_EXISTED, HttpStatus.BAD_REQUEST);
    }

    const newUser = await transactionRepositoryUser.save({
      role: UserRole.USER,
      email,
      password,
    });

    return newUser;
  }

  async updateUser(currentUser: UserEntity, updateUser: UpdateUserDto): Promise<UserEntity> {
    if (updateUser.address) {
      currentUser.address = updateUser.address;
    }
    if (updateUser.first_name) {
      currentUser.first_name = updateUser.first_name;
    }
    if (updateUser.last_name) {
      currentUser.last_name = updateUser.last_name;
    }
    const updatedUser = await this.usersRepositoryMaster.save(currentUser);
    return updatedUser;
  }
}
