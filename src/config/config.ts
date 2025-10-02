
export default () => ({
    database: {
      mongo_Url: process.env.MONGO_URL || 'monogodb',
      redis_Host: process.env.REDIS_HOST || 'redis',
    }
  });
  