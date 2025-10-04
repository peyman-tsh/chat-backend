export interface RateLimitOptions {
    windowSizeSeconds: number; // طول بازه زمانی
    maxRequests: number;       // حداکثر درخواست مجاز
    redisKeyPrefix?: string;   // پیشوند کلیدها در Redis
  }