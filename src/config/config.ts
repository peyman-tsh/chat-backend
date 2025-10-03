
export default () => ({
    database: {
      mongo_Url: process.env.MONGO_URL || 'monogodb',
      redis_Host: process.env.REDIS_HOST || 'redis',
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
  