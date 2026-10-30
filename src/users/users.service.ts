import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { UserRole } from './user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateUserDto,
    tenantId: number,
  ) {
    const existingUser =
      await this.userRepository.findOne({
        where: {
          email: dto.email,
        },
      });

    if (existingUser) {
      throw new ConflictException(
        'Email already used',
      );
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      10,
    );

    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: dto.role ?? UserRole.VIEWER,
      tenantId,
    });

    const savedUser =
      await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  async findAll(tenantId: number) {
    const users = await this.userRepository.find({
      where: {
        tenantId,
        deletedAt: IsNull(),
      },
      order: {
        id: 'DESC',
      },
    });

    return users.map((user) =>
      this.sanitizeUser(user),
    );
  }

  async findOne(
    id: number,
    tenantId: number,
  ) {
    const user =
      await this.userRepository.findOne({
        where: {
          id,
          tenantId,
          deletedAt: IsNull(),
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return this.sanitizeUser(user);
  }

  async update(
    id: number,
    tenantId: number,
    dto: UpdateUserDto,
  ) {
    const user =
      await this.userRepository.findOne({
        where: {
          id,
          tenantId,
          deletedAt: IsNull(),
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser =
        await this.userRepository.findOne({
          where: {
            email: dto.email,
          },
        });

      if (existingUser) {
        throw new ConflictException(
          'Email already used',
        );
      }

      user.email = dto.email;
    }

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(
        dto.password,
        10,
      );
    }

    if (dto.role) {
      user.role = dto.role;
    }

    const savedUser =
      await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  async remove(
    id: number,
    tenantId: number,
  ) {
    const user =
      await this.userRepository.findOne({
        where: {
          id,
          tenantId,
          deletedAt: IsNull(),
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    user.deletedAt = new Date();

    await this.userRepository.save(user);

    return {
      message: 'User deleted successfully',
    };
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
      createdAt: user.createAt,
    };
  }
}