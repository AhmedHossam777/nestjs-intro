import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // inject datasouce
    private readonly datasource: DataSource,
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
    return await this.usersCreateManyProvider.createManyUsers(createUserDtos);
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