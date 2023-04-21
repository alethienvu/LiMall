import { Body, Controller, HttpException, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserService } from 'src/modules/user/users.service';
import { ERROR_MESSAGE_CODE, SUCCESS_MESSAGE_CODE } from 'src/shares/constant';
import { CreateUserDto } from './types/createUser.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { UpdatePassWordDto, UpdateUserDto } from './types/updateUser.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @ApiOperation({
    operationId: 'sign-up',
    description: 'Signup',
    summary: 'Signup',
  })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<UserEntity>> {
    const isExisted = await this.userService.checkUserEmailAddressExisted(createUserDto.email);
    if (!!isExisted) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          metadata: {
            message: ERROR_MESSAGE_CODE.ACCOUNT_EXISTED,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = new UserEntity();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    const createdUser = await this.userService.createUser(user);
    return {
      data: createdUser,
      metadata: {
        message: SUCCESS_MESSAGE_CODE.CREATED_SUCCESS,
      },
    };
  }

  @Put('/info')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'update',
    description: 'Update user infomation',
    summary: 'Update user infomation',
  })
  async updateUser(@UserID() id: number, @Body() updateUser: UpdateUserDto): Promise<ResponseDto<UserEntity>> {
    const updatedUser = await this.userService.updateUser(id, updateUser);
    return {
      data: updatedUser,
      metadata: {
        message: SUCCESS_MESSAGE_CODE.UPDATED_SUCCESS,
      },
    };
  }

  @Put('/password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'change-password',
    description: 'Change password',
    summary: 'Change password',
  })
  async changePass(@UserID() id: number, @Body() changePassWordDto: UpdatePassWordDto): Promise<ResponseDto<string>> {
    await this.userService.changePassWord(id, changePassWordDto);
    return {
      data: SUCCESS_MESSAGE_CODE.CHANGED_PASS.message,
    };
  }
}
