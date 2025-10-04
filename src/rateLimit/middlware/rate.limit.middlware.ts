import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimitService } from '../rate.limit.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly rateLimitService: RateLimitService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const clientKey = req.ip || ''; // می‌توانیم جایگزین کنیم با شناسه کاربر
    const opts = {
      windowSizeSeconds: 60, // پنجره 60 ثانیه
      maxRequests: 5,        // حداکثر 5 درخواست در هر دقیقه
      redisKeyPrefix: 'apilimit',
    };

    const { allowed, remaining } = await this.rateLimitService.isAllowed(clientKey, opts);

    // افزودن اطلاعات به هدر
    res.setHeader('X-RateLimit-Limit', opts.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());

    if (!allowed) {
      return res.status(429).json({
        statusCode: 429,
        message: 'Too Many Requests - Rate limit exceeded.',
      });
    }

    next();
  }
}