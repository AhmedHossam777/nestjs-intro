import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // inject datasouce
    private readonly datasource: DataSource,
  ) {}

  public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];

    // create a QueryRunner instance
    const queryRunner = this.datasource.createQueryRunner();
    // open a connection from query runner to datasource
    await queryRunner.connect();
    // start transactions
    await queryRunner.startTransaction();
    try {
      for (let createUseraDto of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, createUseraDto);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // if error rollback
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      // release transaction
      await queryRunner.release();
    }

    return newUsers;
  }
}