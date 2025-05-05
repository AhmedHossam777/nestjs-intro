import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // inject datasouce
    private readonly datasource: DataSource,
  ) {}

  public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createManyUsers(
      createManyUsersDto,
    );
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

  /**
   * Public method used to find one user using the email of the user
   */
  public findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  public async updateUser(id: number, updateUserDto: PatchUserDto) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // update the user
    await this.usersRepository.update(id, updateUserDto);

    // return the updated user
    return this.findOneById(id);
  }
}