import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user/user.repository';

const commonRepositories = [UserRepository];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature(commonRepositories, 'master'),
    TypeOrmModule.forFeature(commonRepositories, 'report'),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
