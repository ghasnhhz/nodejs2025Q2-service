import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { prisma } from '../common/database';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async signup(signupDto: SignupDto) {
    const { login, password } = signupDto;

    const existingUser = await prisma.user.findUnique({
      where: { login },
    });

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
      },
    });

    return {
      message: 'User created successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const { login, password } = loginDto;

    const user = await prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user.id, user.login);
    const refreshToken = this.generateRefreshToken(user.id, user.login);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    let payload: any;
    try {
      const secret = this.configService.get<string>('JWT_SECRET_REFRESH_KEY');
      payload = jwt.verify(refreshToken, secret);
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const newAccessToken = this.generateAccessToken(user.id, user.login);
    const newRefreshToken = this.generateRefreshToken(user.id, user.login);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private generateAccessToken(userId: string, login: string): string {
    const payload = { userId, login };
    const secret =
      this.configService.get<string>('JWT_SECRET_KEY') || 'test_secret';
    if (!secret) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    const expiresIn =
      this.configService.get<string>('TOKEN_EXPIRE_TIME') || '1h';

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }

  private generateRefreshToken(userId: string, login: string): string {
    const payload = { userId, login };

    const secret =
      this.configService.get<string>('JWT_SECRET_REFRESH_KEY') || 'test_secret';
    if (!secret) {
      throw new Error('JWT_SECRET_REFRESH_KEY is not defined');
    }

    const expiresIn =
      this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME') || '24h';

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }
}
