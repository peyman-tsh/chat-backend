import { getQueueToken } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { Job } from 'bullmq';
import { Server ,Socket } from 'socket.io';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Test, TestingModule } from '@nestjs/testing';

describe('QueueService', () => {
 let module:TestingModule
  let service: QueueService;
 let mockServer: jest.Mocked<Socket> = {
  emit: jest.fn(),
} as any;

 beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [QueueService]
    })
      .overrideProvider(getQueueToken('sendNotif'))
      .useValue({ /* mocked queue */ })
      .compile()
    mockServer = {
      process: jest.fn(),
    } as any;

    service = new QueueService();
    service.server = mockServer;
  });

  it('باید new_message را با job.data بفرستد و true برگرداند', async () => {
    const fakeJob = {
      data: { text: 'Hello world', userId: '123' }
    } as Job as any; // Mock برای BullMQ Job

    const result = await service.process(fakeJob);

    expect(mockServer.emit).toHaveBeenCalledTimes(1);
    expect(mockServer.emit).toHaveBeenCalledWith('new_message', fakeJob.data);
    expect(result).toBe(true);
  });
});