import { Controller, Delete, Post, Param, UseGuards, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ERROR_MESSAGE_CODE, SUCCESS_MESSAGE_CODE } from 'src/shares/constant';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OnlySuperAdmin } from '../auth/guards/roles.guard';
import { AdminService } from './admins.service';
import { UserEntity } from 'src/models/entities/user.entity';
import { CreateAdminDto } from './types/createAdmin.dto';

@Controller('admin')
@ApiBearerAuth()
@ApiTags('Admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/signup')
  @ApiOperation({
    operationId: 'sign-up',
    description: 'Admin create an user',
    summary: 'Admin create an user',
  })
  @UseGuards(JwtAuthGuard, OnlySuperAdmin)
  async signUp(@Body() createAdminDto: CreateAdminDto): Promise<ResponseDto<UserEntity>> {
    const isExisted = await this.adminService.checkUserEmailAddressExisted(createAdminDto.email);
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
    user.email = createAdminDto.email;
    user.password = createAdminDto.password;
    user.role = createAdminDto.role;
    const createdUser = await this.adminService.createAdmin(user);
    return {
      data: createdUser,
      metadata: {
        message: SUCCESS_MESSAGE_CODE.CREATED_SUCCESS,
      },
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, OnlySuperAdmin)
  @ApiOperation({
    operationId: 'admin-delete-user',
    description: 'Admin delete an user',
    summary: 'Admin delete an user',
  })
  async deleteUser(@Param('id') id: number): Promise<ResponseDto<string>> {
    const isDeleted = await this.adminService.deleteUser(id);
    if (isDeleted) {
      return {
        data: SUCCESS_MESSAGE_CODE.DELETED_SUCCESS.message,
      };
    } else {
      return {
        data: ERROR_MESSAGE_CODE.NO_RECORD_DELETED.message,
      };
    }
  }
}
