import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { AuthUser } from '../auth/types/auth-user.type';
import { AddressDto } from './dto/address.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(user: AuthUser, dto: UpdateProfileDto) {
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findFirst({
        where: { phone: dto.phone, NOT: { id: user.id } },
      });
      if (existingPhone) throw new ConflictException('Phone is already registered');
    }
    const firstName = dto.firstName;
    const lastName = dto.lastName;
    const fullName = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined;
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { ...dto, fullName },
    });
    return this.toPublicUser(updated);
  }

  async changePassword(user: AuthUser, dto: ChangePasswordDto) {
    const current = await this.prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    if (!(await bcrypt.compare(dto.currentPassword, current.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(dto.newPassword, 12) },
    });
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { passwordChanged: true };
  }

  listAddresses(user: AuthUser) {
    return this.prisma.userAddress.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(user: AuthUser, dto: AddressDto) {
    return this.prisma.$transaction(async (tx) => {
      const count = await tx.userAddress.count({ where: { userId: user.id } });
      const shouldDefault = dto.isDefault ?? count === 0;
      if (shouldDefault) await tx.userAddress.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
      return tx.userAddress.create({ data: { ...dto, isDefault: shouldDefault, userId: user.id } });
    });
  }

  async updateAddress(user: AuthUser, addressId: string, dto: Partial<AddressDto>) {
    await this.assertOwnsAddress(user.id, addressId);
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) await tx.userAddress.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
      return tx.userAddress.update({ where: { id: addressId }, data: dto });
    });
  }

  async deleteAddress(user: AuthUser, addressId: string) {
    const address = await this.assertOwnsAddress(user.id, addressId);
    await this.prisma.userAddress.delete({ where: { id: addressId } });
    if (address.isDefault) {
      const next = await this.prisma.userAddress.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      if (next) await this.prisma.userAddress.update({ where: { id: next.id }, data: { isDefault: true } });
    }
    return { deleted: true };
  }

  private async assertOwnsAddress(userId: string, addressId: string) {
    const address = await this.prisma.userAddress.findUnique({ where: { id: addressId } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId) throw new ForbiddenException('Address does not belong to current user');
    return address;
  }

  private toPublicUser(user: {
    id: string;
    uuid: string;
    email: string;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    profileImage: string | null;
    role: string;
    status: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
