// rate-limit.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitService } from './rate.limit.service';
import { Redis } from 'ioredis';
import { RateLimitOptions } from './interfaces/IRateLimit';

// Mock Redis با تنظیم مستقیم mockResolvedValue برای هر متد
jest.mock('ioredis', () => {
  return {
    Redis: jest.fn().mockImplementation(() => ({
      zremrangebyscore: jest.fn().mockResolvedValue(0),
      zcard: jest.fn().mockResolvedValue(0),
      zadd: jest.fn().mockResolvedValue(1),
      expire: jest.fn().mockResolvedValue(1),
    })),
  };
});

describe('RateLimitService', () => {
  let service: RateLimitService;
  let redisMock: jest.Mocked<Redis>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateLimitService],
    }).compile();

    service = module.get<RateLimitService>(RateLimitService);
    redisMock = (service as any).redis as jest.Mocked<Redis>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isAllowed', () => {
    const mockOpts: RateLimitOptions = {
      maxRequests: 5,
      windowSizeSeconds: 60,
      redisKeyPrefix: 'test',
    };

    const key = 'user123';
    const redisKey = `${mockOpts.redisKeyPrefix}:${key}`;

    it('should allow request when under limit', async () => {
      const now = Date.now();
      redisMock.zremrangebyscore.mockResolvedValue(0); // هیچ قدیمی پاک نشد
      redisMock.zcard.mockResolvedValue(2); // 2 درخواست موجود
      redisMock.zadd.mockResolvedValue('1');
      redisMock.expire.mockResolvedValue(1);

      const result = await service.isAllowed(key, mockOpts);

      expect(result).toEqual({ allowed: true, remaining: 2 }); // 5 - (2 + 1) = 2
      expect(redisMock.zremrangebyscore).toHaveBeenCalledWith(
        redisKey,
        0,
        now - mockOpts.windowSizeSeconds * 1000,
      );
      expect(redisMock.zcard).toHaveBeenCalledWith(redisKey);
      expect(redisMock.zadd).toHaveBeenCalledWith(redisKey, now, now.toString());
      expect(redisMock.expire).toHaveBeenCalledWith(redisKey, mockOpts.windowSizeSeconds);
    });

    it('should deny request when over limit', async () => {
      const now = Date.now();
      redisMock.zremrangebyscore.mockResolvedValue(0);
      redisMock.zcard.mockResolvedValue(5); // حداکثر تعداد رسیده

      const result = await service.isAllowed(key, mockOpts);

      expect(result).toEqual({ allowed: false, remaining: 0 });
      expect(redisMock.zadd).not.toHaveBeenCalled(); // نباید اضافه بشه
      expect(redisMock.expire).not.toHaveBeenCalled();
    });

    it('should clean up old requests', async () => {
      const now = Date.now();
      redisMock.zremrangebyscore.mockResolvedValue(2); // 2 درخواست قدیمی پاک شد
      redisMock.zcard.mockResolvedValue(2); // پس از پاکسازی، 2 باقی مانده
      redisMock.zadd.mockResolvedValue('1');
      redisMock.expire.mockResolvedValue(1);

      const result = await service.isAllowed(key, mockOpts);

      expect(result).toEqual({ allowed: true, remaining: 2 });
      expect(redisMock.zremrangebyscore).toHaveBeenCalledWith(
        redisKey,
        0,
        now - mockOpts.windowSizeSeconds * 1000,
      );
    });

    it('should use default redisKeyPrefix if not provided', async () => {
      const optsWithoutPrefix: RateLimitOptions = {
        maxRequests: 5,
        windowSizeSeconds: 60,
      };
      const defaultRedisKey = `ratelimit:${key}`;

      redisMock.zremrangebyscore.mockResolvedValue(0);
      redisMock.zcard.mockResolvedValue(0);
      redisMock.zadd.mockResolvedValue('1');
      redisMock.expire.mockResolvedValue(1);

      await service.isAllowed(key, optsWithoutPrefix);

      expect(redisMock.zremrangebyscore).toHaveBeenCalledWith(
        defaultRedisKey,
        0,
        expect.any(Number),
      );
    });

    it('should handle Redis connection errors', async () => {
      redisMock.zremrangebyscore.mockRejectedValue(new Error('Redis error'));

      await expect(service.isAllowed(key, mockOpts)).rejects.toThrow('Redis error');
    });
  });
});