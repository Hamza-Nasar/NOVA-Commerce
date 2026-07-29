import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/types/auth-user.type';
import { AddressDto } from './dto/address.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Patch('profile')
  updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user, dto);
  }

  @Patch('change-password')
  changePassword(@CurrentUser() user: AuthUser, @Body() dto: ChangePasswordDto) {
    return this.users.changePassword(user, dto);
  }

  @Get('addresses')
  addresses(@CurrentUser() user: AuthUser) {
    return this.users.listAddresses(user);
  }

  @Post('addresses')
  createAddress(@CurrentUser() user: AuthUser, @Body() dto: AddressDto) {
    return this.users.createAddress(user, dto);
  }

  @Patch('addresses/:id')
  updateAddress(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: Partial<AddressDto>) {
    return this.users.updateAddress(user, id, dto);
  }

  @Delete('addresses/:id')
  deleteAddress(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.users.deleteAddress(user, id);
  }
}
