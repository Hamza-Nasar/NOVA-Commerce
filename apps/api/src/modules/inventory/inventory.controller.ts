import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { InventoryService } from './inventory.service';

class AdjustInventoryBody {
  @IsString()
  warehouseId!: string;

  @Type(() => Number)
  @IsInt()
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

class ReserveStockBody {
  @IsString()
  cartId!: string;

  @IsOptional()
  @IsString()
  productVariantId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  ttlMinutes?: number;
}

class WarehouseBody {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

const AdminInventoryAccess = () =>
  UseGuards(JwtAuthGuard, RolesGuard);

@Controller()
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get('products/variants/:variantId/availability')
  availability(@Param('variantId') id: string) {
    return this.service.availability(id);
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('admin/inventory')
  list() {
    return this.service.list();
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('admin/inventory/low-stock')
  low() {
    return this.service.lowStock();
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('admin/inventory/movements')
  movements() {
    return this.service.movements();
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch('admin/inventory/:variantId')
  adjust(@Param('variantId') variantId: string, @Body() body: AdjustInventoryBody) {
    return this.service.adjust(
      body.warehouseId,
      variantId,
      body.quantity,
      body.reason,
      body.createdBy,
    );
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Post('admin/warehouses')
  createWarehouse(@Body() body: WarehouseBody) {
    return this.service.createWarehouse(body);
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('admin/warehouses')
  warehouses() {
    return this.service.warehouses();
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('admin/warehouses/:id')
  warehouse(@Param('id') id: string) {
    return this.service.warehouse(id);
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch('admin/warehouses/:id')
  updateWarehouse(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.updateWarehouse(id, body);
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete('admin/warehouses/:id')
  deleteWarehouse(@Param('id') id: string) {
    return this.service.deleteWarehouse(id);
  }

  @Post('cart/reserve')
  reserve(@Body() body: ReserveStockBody) {
    if (body.productVariantId) {
      return this.service.reserve(
        body.cartId,
        body.productVariantId,
        body.quantity ?? 1,
        body.ttlMinutes,
      );
    }

    return this.service.reserveCart(body.cartId, body.ttlMinutes);
  }

  @Delete('cart/reservation/:id')
  release(@Param('id') id: string) {
    return this.service.release(id);
  }

  @AdminInventoryAccess()
  @Roles(Role.ADMIN, Role.MANAGER)
  @Post('admin/inventory/expire-reservations')
  expire() {
    return this.service.expire();
  }
}
