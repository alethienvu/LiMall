import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/models/entities/user.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { UserService } from 'src/modules/user/users.service';
import { httpErrors } from 'src/shares/exceptions';
import { CreateUserDto } from './type/createUser.dto';
import * as crypto from 'crypto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { UpdatePassWordDto, UpdateUserDto } from './type/updateUser.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService, private readonly mailService: MailService) {}

  @Post('/signup')
  @ApiOperation({
    operationId: 'signUp',
    description: 'Signup',
    summary: 'Signup',
  })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<string>> {
    const isExisted = await this.userService.checkUserEmailAddressExisted(createUserDto.email);
    if (!!isExisted) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          metadata: {
            message: httpErrors.ACCOUNT_EXISTED,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = new UserEntity();
    user.email = createUserDto.email;
    user.password = crypto.createHmac('sha256', createUserDto.password).digest('hex');
    await this.userService.createUser(user);
    return {
      data: 'Created',
    };
  }

  @Put('/update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'update',
    description: 'Update',
    summary: 'Update',
  })
  async updateUser(@Param('id') id: number, @Body() updateUser: UpdateUserDto): Promise<ResponseDto<string>> {
    await this.userService.updateUser(id, updateUser);
    return {
      data: 'Updated',
    };
  }

  @Put('/change-password/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'change-password',
    description: 'Change password',
    summary: 'Change password',
  })
  async changePass(
    @Param('id') id: number,
    @Body() changePassWordDto: UpdatePassWordDto,
  ): Promise<ResponseDto<string>> {
    await this.userService.changePassWord(id, changePassWordDto);
    return {
      data: 'Updated',
    };
  }
}
