import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
@Injectable()
export class InventoryService {
  constructor(private readonly prisma:PrismaService){}
  async availability(variantId:string){const levels=await this.prisma.inventoryLevel.findMany({where:{productVariantId:variantId,warehouse:{status:'ACTIVE'}},include:{warehouse:true}});if(!levels.length)throw new NotFoundException('Inventory not found');return {variantId,available:levels.reduce((n,l)=>n+l.quantityAvailable,0),reserved:levels.reduce((n,l)=>n+l.quantityReserved,0),sellable:levels.reduce((n,l)=>n+Math.max(0,l.quantityAvailable-l.quantityReserved),0),warehouses:levels};}
  async list(){return this.prisma.inventoryLevel.findMany({include:{warehouse:true,variant:{include:{product:true}}},orderBy:{updatedAt:'desc'}});}
  async lowStock(){return this.prisma.inventoryLevel.findMany({where:{quantityAvailable:{lte:0}},include:{warehouse:true,variant:{include:{product:true}}}});}
  async adjust(warehouseId:string,productVariantId:string,quantity:number,reason?:string,createdBy?:string){if(!Number.isInteger(quantity)||quantity===0)throw new BadRequestException('Invalid adjustment');return this.prisma.$transaction(async tx=>{const level=await tx.inventoryLevel.findUnique({where:{warehouseId_productVariantId:{warehouseId,productVariantId}}});if(!level)throw new NotFoundException('Inventory not found');const next=level.quantityAvailable+quantity;if(next<0)throw new BadRequestException('Adjustment would create negative stock');const updated=await tx.inventoryLevel.update({where:{id:level.id},data:{quantityAvailable:next}});await tx.inventoryMovement.create({data:{warehouseId,productVariantId,type:'ADJUSTMENT',quantity:Math.abs(quantity),reason,createdBy}});return updated;});}
}
