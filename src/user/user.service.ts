import { Injectable } from '@nestjs/common';
import { db } from '../common/database';
import { User } from './interfaces/user.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { generateId } from 'src/common/uuid';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UserService {
  findAll(): UserResponseDto[] {
    return db.users.map((user) => ({
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  findOne(id: string): UserResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userId format!');
    }

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`Not not found.`);
    }

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  create(dto: CreateUserDto): UserResponseDto {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('login and password required!');
    }

    if (dto.password.length < 3) {
      throw new BadRequestException('password must be at least 3 characters!');
    }

    const newUser: User = {
      id: generateId(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    db.users.push(newUser);

    const user = {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): UserResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userId format!');
    }

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong!');
    }

    user.password = updatePasswordDto.newPassword;
    user.version++;
    user.updatedAt = Date.now();

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userId format!');
    }

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    db.users = db.users.filter((user) => user.id !== id);
  }
}
