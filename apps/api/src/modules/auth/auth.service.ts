import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from './types/auth-user.type';

type ClientContext = {
  device?: string;
  ipAddress?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto, context: ClientContext) {
    await this.assertUniqueIdentity(dto.email, dto.phone);
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        fullName: `${dto.firstName} ${dto.lastName}`.trim(),
        passwordHash,
      },
    });
    const tokens = await this.issueTokens(user, context);
    return { user: this.toPublicUser(user), ...tokens };
  }

  async login(dto: LoginDto, context: ClientContext) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('User account is suspended');
    }
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), status: user.status === UserStatus.PENDING ? UserStatus.ACTIVE : user.status },
    });
    const tokens = await this.issueTokens(updated, context);
    return { user: this.toPublicUser(updated), ...tokens };
  }

  async refresh(refreshToken: string, context: ClientContext) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    if (!stored || stored.user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    const tokens = await this.issueTokens(stored.user, context);
    return { user: this.toPublicUser(stored.user), ...tokens };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return { loggedOut: true };
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { loggedOut: true };
  }

  forgotPassword() {
    return { accepted: true, message: 'Password reset delivery will be handled by the notifications module.' };
  }

  resetPassword() {
    return { accepted: true, message: 'Reset token verification will be enabled when email delivery is wired.' };
  }

  async getMe(user: AuthUser) {
    const current = await this.prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    return this.toPublicUser(current);
  }

  private async assertUniqueIdentity(email: string, phone?: string) {
    const existingEmail = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingEmail) throw new ConflictException('Email is already registered');
    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({ where: { phone } });
      if (existingPhone) throw new ConflictException('Phone is already registered');
    }
  }

  private async issueTokens(user: AuthUser, context: ClientContext) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN') as never,
    });
    const refreshToken = randomBytes(48).toString('hex');
    const refreshDays = this.config.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN_DAYS');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000),
        device: context.device,
        ipAddress: context.ipAddress,
      },
    });
    return { accessToken, refreshToken };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private toPublicUser(user: AuthUser & { firstName?: string | null; lastName?: string | null; fullName?: string | null; phone?: string | null; profileImage?: string | null; emailVerified?: boolean; phoneVerified?: boolean; lastLogin?: Date | null; createdAt?: Date; updatedAt?: Date }) {
    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      phone: user.phone ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      fullName: user.fullName ?? null,
      profileImage: user.profileImage ?? null,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified ?? false,
      phoneVerified: user.phoneVerified ?? false,
      lastLogin: user.lastLogin ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
