import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiscoveryService } from './discovery.service';

@Controller('users/recently-viewed')
@UseGuards(JwtAuthGuard)
export class DiscoveryController {
  constructor(private readonly discovery: DiscoveryService) {}
  @Post() add(@Req() req: { user: { sub: string } }, @Body('productId') productId: string) { return this.discovery.addRecentlyViewed(req.user.sub, productId); }
  @Get() list(@Req() req: { user: { sub: string } }) { return this.discovery.listRecentlyViewed(req.user.sub); }
}
