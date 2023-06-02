import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('test')
export class AudioConsumer {
  @Process()
  async transcode(job: Job<unknown>) {
    console.log('test', job.data);

    return 'jo';
  }
}
