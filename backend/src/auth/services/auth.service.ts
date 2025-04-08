import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Logger } from 'nestjs-pino';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { UserResponseDto } from '../dto/user-response.dto';

interface UserPayload {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserPayload | null> {
    this.logger.debug(`Validating user: ${username}`);
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(
    user: UserPayload,
  ): Promise<{ access_token: string; user: UserResponseDto }> {
    this.logger.debug(`User login: ${user.username}`);
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: new UserResponseDto({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      }),
    };
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    this.logger.debug(`Registering new user: ${registerDto.username}`);

    // Check if username already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (existingUser) {
      if (existingUser.username === registerDto.username) {
        throw new ConflictException('Username is already taken');
      }
      if (existingUser.email === registerDto.email) {
        throw new ConflictException('Email is already registered');
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // Create new user
    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    this.logger.debug(`User registered successfully with id: ${savedUser.id}`);

    // Remove password from response
    const { password, ...result } = savedUser;
    return new UserResponseDto(result);
  }

  async findById(id: number): Promise<UserResponseDto> {
    this.logger.debug(`Finding user by id: ${id}`);
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new UserResponseDto(user);
  }
}
