import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // inject datasouce
    private readonly datasouce: DataSource,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    // Create the user
    return newUser;
  }

  public async createManyUsers(createUserDtos: CreateUserDto[]) {
    let newUsers: User[] = [];

    // create a QueryRunner instance
    const queryRunner = this.datasouce.createQueryRunner();
    // open a connection from query runner to datasource
    await queryRunner.connect();
    // start transactions
    await queryRunner.startTransaction();
    try {
      for (let createUseraDto of createUserDtos) {
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

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  /**
   * Public method used to find one user using the ID of the user
   */
  public findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
}