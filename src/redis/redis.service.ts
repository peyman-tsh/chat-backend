// redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IRedisService } from './IRedis';

@Injectable()
export class RedisService implements IRedisService{
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: '127.0.0.1',
      port: 6379
    });
  }

  async saveOfflineMessage(receiverId: string, message: string):Promise<void> {
    // ذخیره در لیستی به اسم offline:receiverId
    await this.client.rpush(`offline:${receiverId}`, JSON.stringify(message));
  }

  async getOfflineMessages(receiverId: string): Promise<string[]> {
    const messages = await this.client.lrange(`offline:${receiverId}`, 0, -1);
    return messages.map(m => JSON.parse(m));
  }

  async deleteOfflineMessages(receiverId: string) {
    await this.client.del(`offline:${receiverId}`);
  }

  async getOnlineUser(userId:string):Promise<string|null>{
    return await this.client.get(`online:${userId}`)
  }
 
  async setUserOnline(userId:string,socketId:string):Promise<string|null>{
    return await this.client.set(`online:${userId}`,socketId)
  }

}