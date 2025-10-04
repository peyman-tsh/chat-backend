import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RateLimitOptions } from './interfaces/IRateLimit';

@Injectable()
export class RateLimitService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  async isAllowed(
    key: string,
    opts: RateLimitOptions
  ): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    const windowMilliseconds = opts.windowSizeSeconds * 1000;
    const redisKey = `${opts.redisKeyPrefix || 'ratelimit'}:${key}`;

    // 1. پاک‌کردن درخواست‌های قدیمی خارج از پنجره
    await this.redis.zremrangebyscore(redisKey, 0, now - windowMilliseconds);

    // 2. تعداد درخواست های فعلی داخل پنجره
    const currentCount = await this.redis.zcard(redisKey);

    // 3. بررسی مجاز بودن
    if (currentCount >= opts.maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    // 4. اضافه کردن درخواست جدید (timestamp=score)
    await this.redis.zadd(redisKey, now, now.toString());

    // 5. تنظیم TTL کلید برای تمیزکاری خودکار
    await this.redis.expire(redisKey, opts.windowSizeSeconds);

    return {
      allowed: true,
      remaining: opts.maxRequests - (currentCount + 1),
    };
  }
}