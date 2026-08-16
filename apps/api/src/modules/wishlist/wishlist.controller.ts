import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistService } from './wishlist.service';

type AuthRequest = Request & {
  user: {
    id: string;
  };
};

class WishlistItemBody {
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  variantId?: string;
}

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly service: WishlistService) {}

  @Get()
  list(@Req() request: AuthRequest) {
    return this.service.list(request.user.id);
  }

  @Post('items')
  add(@Req() request: AuthRequest, @Body() body: WishlistItemBody) {
    return this.service.add(request.user.id, body);
  }

  @Delete('items/:id')
  remove(@Req() request: AuthRequest, @Param('id') id: string) {
    return this.service.remove(request.user.id, id);
  }

  @Post('items/:id/move-to-cart')
  move(@Req() request: AuthRequest, @Param('id') id: string) {
    return this.service.moveToCart(request.user.id, id);
  }
}
