import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
@Controller()
export class InventoryController{constructor(private readonly service:InventoryService){}@Get('products/variants/:variantId/availability') availability(@Param('variantId')id:string){return this.service.availability(id)}@Get('admin/inventory') list(){return this.service.list()}@Get('admin/inventory/low-stock') low(){return this.service.lowStock()}@Patch('admin/inventory/:variantId') adjust(@Param('variantId')variantId:string,@Body()b:any){return this.service.adjust(b.warehouseId,variantId,b.quantity,b.reason,b.createdBy)}}
