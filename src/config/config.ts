
export default () => ({
    database: {
      mongo_Url: process.env.MONGO_URL || 'monogodb',
      redis_Url: process.env.REDIS_URL || 'redis',
      redis_Port:Number(process.env.REDIS_PORT) || 6379,
      bullmq:process.env.BULL_MQ
    },
    throttler:{
      shortTTL:Number(process.env.SHORT_TTL) || 1000,
      shostLIMIT:Number(process.env.SHORT_LIMIT) || 3,
      mediumTTL:Number(process.env.MEDIUM_TTL) || 10000,
      mediumLIMIT:Number(process.env.MEDIUM_LIMIT) || 20,
      longTTL:Number(process.env.LONG_TTL) || 60000,
      longLIMIT:Number(process.env.LONG_LIMIT) || 100
    }
  });
  