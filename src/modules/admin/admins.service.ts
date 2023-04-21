import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/entities/user.entity';
import { ERROR_MESSAGE_CODE } from 'src/shares/constant';
import { DeleteResult, Repository, Transaction, TransactionRepository } from 'typeorm';
import { MailService } from 'src/modules/mail/mail.service';
import { UserRepository } from '../user/user.repository';
import { CreateAdminDto } from './types/createAdmin.dto';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
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
      throw new HttpException(ERROR_MESSAGE_CODE.ACCOUNT_NOT_FOUND, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(ERROR_MESSAGE_CODE.ACCOUNT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  @Transaction({ connectionName: 'master' })
  async createAdmin(
    createAdminDto: CreateAdminDto,
    @TransactionRepository(UserEntity) usersRepositoryMaster?: Repository<UserEntity>,
  ): Promise<UserEntity> {
    const { email, password, role } = createAdminDto;
    const sameEmailAddress = await this.checkUserEmailAddressExisted(email);
    if (!!sameEmailAddress) {
      throw new HttpException(ERROR_MESSAGE_CODE.ACCOUNT_EXISTED, HttpStatus.BAD_REQUEST);
    }
    const hashPass = crypto.createHmac('sha256', password).digest('hex');
    const newUser = await usersRepositoryMaster.save({
      email,
      password: hashPass,
      role,
    });
    this.mailService.sendMail(newUser.email, 'Sign up to LiMall successfully!', `You signed up to LiMall as ${role}.`);
    return newUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const removedUser: DeleteResult = await this.usersRepositoryMaster.delete({ id });
    const { affected } = removedUser;
    return !!affected;
  }
}
