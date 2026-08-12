import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from '../../database/database.module';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { QUEUES } from '../../queue/queue.constants';
import { InventoryExpiryProcessor } from './inventory-expiry.processor';
@Module({imports:[DatabaseModule,BullModule.registerQueue({name:QUEUES.INVENTORY})],controllers:[InventoryController],providers:[InventoryService,InventoryExpiryProcessor],exports:[InventoryService]})
export class InventoryModule{}
