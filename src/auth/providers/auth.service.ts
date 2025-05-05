import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { LoginDto } from '../dto/login.dto';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    // Injecting HashingProvider
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    // Check if user exists
    if (!user) {
      throw new UnauthorizedException('wrong email or password');
    }
    const isPasswordValid = await this.hashingProvider.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('wrong email or password');
    }

    return user;
  }

  public isAuth() {
    return true;
  }
}