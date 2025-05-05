import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser: User | null = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    let newUser = this.usersRepository.create(createUserDto);
    // Hash the password
    newUser.password = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );

    newUser = await this.usersRepository.save(newUser);

    // Create the user
    return newUser;
  }
}