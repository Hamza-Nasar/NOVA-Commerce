import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Request } from 'express';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { CartService } from './cart.service';

type AuthRequest = Request & {
  user?: {
    id?: string;
  };
};

type HeaderMap = Record<string, string | string[] | undefined>;

class AddCartItemBody {
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  variantId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  quantity!: number;
}

class ApplyCouponBody {
  @IsString()
  code!: string;
}

@Controller('cart')
@UseGuards(OptionalJwtGuard)
export class CartController {
  constructor(private readonly service: CartService) {}

  private ids(req: AuthRequest, headers: HeaderMap) {
    const guestHeader = headers['x-guest-session-id'];
    const guest = Array.isArray(guestHeader) ? guestHeader[0] : guestHeader;

    return { user: req.user?.id, guest };
  }

  @Get()
  get(@Req() req: AuthRequest, @Headers() headers: HeaderMap) {
    const ids = this.ids(req, headers);
    return this.service.get(ids.user, ids.guest);
  }

  @Get('summary')
  summary(@Req() req: AuthRequest, @Headers() headers: HeaderMap) {
    const ids = this.ids(req, headers);
    return this.service.get(ids.user, ids.guest);
  }

  @Post('items')
  add(
    @Req() req: AuthRequest,
    @Headers() headers: HeaderMap,
    @Body() body: AddCartItemBody,
  ) {
    const ids = this.ids(req, headers);
    return this.service.add(ids.user, ids.guest, body);
  }

  @Patch('items/:id')
  update(
    @Req() req: AuthRequest,
    @Headers() headers: HeaderMap,
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    const ids = this.ids(req, headers);
    return this.service.update(ids.user, ids.guest, id, quantity);
  }

  @Delete('items/:id')
  remove(
    @Req() req: AuthRequest,
    @Headers() headers: HeaderMap,
    @Param('id') id: string,
  ) {
    const ids = this.ids(req, headers);
    return this.service.remove(ids.user, ids.guest, id);
  }

  @Delete()
  clear(@Req() req: AuthRequest, @Headers() headers: HeaderMap) {
    const ids = this.ids(req, headers);
    return this.service.clear(ids.user, ids.guest);
  }

  @Post('apply-coupon')
  coupon(
    @Req() req: AuthRequest,
    @Headers() headers: HeaderMap,
    @Body() body: ApplyCouponBody,
  ) {
    const ids = this.ids(req, headers);
    return this.service.applyCoupon(ids.user, ids.guest, body.code);
  }

  @Delete('coupon')
  removeCoupon(@Req() req: AuthRequest, @Headers() headers: HeaderMap) {
    const ids = this.ids(req, headers);
    return this.service.removeCoupon(ids.user, ids.guest);
  }

  @Post('merge')
  merge(@Req() req: AuthRequest, @Headers() headers: HeaderMap) {
    const ids = this.ids(req, headers);
    if (!ids.user) {
      return this.service.merge('', ids.guest ?? '');
    }

    return this.service.merge(ids.user, ids.guest ?? '');
  }
}
