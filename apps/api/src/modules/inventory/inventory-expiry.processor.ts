import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../queue/queue.constants';
import { InventoryService } from './inventory.service';

@Processor(QUEUES.INVENTORY)
export class InventoryExpiryProcessor extends WorkerHost {
  constructor(private readonly inventory: InventoryService) { super(); }
  async process(job: Job<{ reservationId?: string }>) {
    if (job.name === 'release-reservation' && job.data.reservationId) return this.inventory.release(job.data.reservationId);
    if (job.name === 'expire-reservations') return this.inventory.expire();
    return { ignored: true };
  }
}
