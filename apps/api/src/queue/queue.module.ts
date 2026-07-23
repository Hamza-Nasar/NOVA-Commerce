import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from './notifications.processor';
import { QUEUES } from './queue.constants';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUES.NOTIFICATIONS })],
  providers: [NotificationsProcessor],
  exports: [BullModule],
})
export class QueueModule {}
