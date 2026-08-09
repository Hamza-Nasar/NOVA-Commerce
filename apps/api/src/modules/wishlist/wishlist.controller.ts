import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistService } from './wishlist.service';
@Controller('wishlist') @UseGuards(JwtAuthGuard)
export class WishlistController { constructor(private readonly service:WishlistService){} @Get() list(@Req()r:any){return this.service.list(r.user.sub)} @Post('items') add(@Req()r:any,@Body()b:any){return this.service.add(r.user.sub,b)} @Delete('items/:id') remove(@Req()r:any,@Param('id')id:string){return this.service.remove(r.user.sub,id)} @Post('items/:id/move-to-cart') move(@Req()r:any,@Param('id')id:string){return this.service.moveToCart(r.user.sub,id)} }
