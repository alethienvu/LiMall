import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserRepository } from 'src/models/repositories/user.repository';
import { CreateUserDto } from 'src/modules/user/type/createUser.dto';
import { UserRole } from 'src/shares/enums/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { UpdatePassWordDto, UpdateUserDto } from './type/updateUser.dto';
import { MailService } from 'src/modules/mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository, 'master') private usersRepositoryMaster: UserRepository,
    @InjectRepository(UserRepository, 'report') private usersRepositoryReport: UserRepository,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
  ) {}

  async checkUserIdExisted(id: number): Promise<boolean> {
    const user = await this.usersRepositoryReport.findOne({
      where: {
        id: id,
      },
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
      email,
      password,
      role: UserRole.USER,
    });
    this.mailService.sendMail(newUser.email, 'Sign up to LiMall successfully!', 'You signed up to LiMall');
    return newUser;
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<UserEntity> {
    const currentUser = await this.findUserById(id);
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
  async changePassWord(id: number, updatePassWordDto: UpdatePassWordDto): Promise<UserEntity> {
    const currentUser = await this.findUserById(id);
    const { currently_pass, new_pass } = updatePassWordDto;
    const compare_pass = crypto.createHmac('sha256', currently_pass).digest('hex');
    if (currentUser.password !== compare_pass) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    currentUser.password = crypto.createHmac('sha256', new_pass).digest('hex');
    const updatedUser = await this.usersRepositoryMaster.save(currentUser);
    return updatedUser;
  }
}
