import { Injectable } from '@nestjs/common';
import { prisma } from '../common/database';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UserService {
  async findAll(): Promise<UserResponseDto[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    }));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userId format!');
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Not not found.`);
    }

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('login and password required!');
    }

    if (dto.password.length < 3) {
      throw new BadRequestException('password must be at least 3 characters!');
    }

    const newUser = await prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        version: 1,
      },
    });

    const user: UserResponseDto = {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt.getTime(),
      updatedAt: newUser.updatedAt.getTime(),
    };

    return user;
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userId format!');
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found!`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password does not match!');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
      },
    });

    return {
      id: updatedUser.id,
      login: updatedUser.login,
      version: updatedUser.version,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userId format!');
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}
