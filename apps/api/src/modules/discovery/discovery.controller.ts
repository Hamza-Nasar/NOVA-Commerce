import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiscoveryService } from './discovery.service';

class RecentlyViewedBody {
  @IsString()
  productId!: string;
}

@Controller('users/recently-viewed')
@UseGuards(JwtAuthGuard)
export class DiscoveryController {
  constructor(private readonly discovery: DiscoveryService) {}
  @Post() add(@Req() req: { user: { id: string } }, @Body() body: RecentlyViewedBody) { return this.discovery.addRecentlyViewed(req.user.id, body.productId); }
  @Get() list(@Req() req: { user: { id: string } }) { return this.discovery.listRecentlyViewed(req.user.id); }
}
