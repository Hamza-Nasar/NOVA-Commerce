import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(OptionalJwtGuard)
export class CartController {
  constructor(private readonly service: CartService) {}
  private ids(req: any, headers: any) { return { user: req.user?.sub, guest: headers['x-guest-session-id'] }; }
  @Get() get(@Req() req: any, @Headers() h: any) { const x=this.ids(req,h); return this.service.get(x.user,x.guest); }
  @Get('summary') summary(@Req() req:any,@Headers() h:any){const x=this.ids(req,h);return this.service.get(x.user,x.guest);}
  @Post('items') add(@Req() req:any,@Headers() h:any,@Body() b:any){const x=this.ids(req,h);return this.service.add(x.user,x.guest,b);}
  @Patch('items/:id') update(@Req() req:any,@Headers() h:any,@Param('id') id:string,@Body('quantity') q:number){const x=this.ids(req,h);return this.service.update(x.user,x.guest,id,q);}
  @Delete('items/:id') remove(@Req() req:any,@Headers() h:any,@Param('id') id:string){const x=this.ids(req,h);return this.service.remove(x.user,x.guest,id);}
  @Delete() clear(@Req() req:any,@Headers() h:any){const x=this.ids(req,h);return this.service.clear(x.user,x.guest);}
  @Post('apply-coupon') coupon(@Req() req:any,@Headers() h:any,@Body('code') code:string){const x=this.ids(req,h);return this.service.applyCoupon(x.user,x.guest,code);}
  @Delete('coupon') removeCoupon(@Req() req:any,@Headers() h:any){const x=this.ids(req,h);return this.service.removeCoupon(x.user,x.guest);}
  @Post('merge') merge(@Req() req:any,@Headers() h:any){return this.service.merge(req.user.sub,h['x-guest-session-id']);}
}
