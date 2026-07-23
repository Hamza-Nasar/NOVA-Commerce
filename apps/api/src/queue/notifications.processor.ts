import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from './queue.constants';

@Processor(QUEUES.NOTIFICATIONS)
export class NotificationsProcessor extends WorkerHost {
  async process(job: Job<{ recipient: string; template: string }>) {
    // Email/SMS/push providers are deliberately plugged in by the Notifications domain later.
    return { accepted: true, jobId: job.id };
  }
}
