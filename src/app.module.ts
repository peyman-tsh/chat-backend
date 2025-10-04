import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {ThrottlerModule} from "@nestjs/throttler";
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import config from './config/config';
import { UserModule } from './users/user.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(config().database.mongo_Url),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(config().database.redis_Url),
          ],
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: config().throttler.shortTTL,
        limit: config().throttler.shostLIMIT,
      },
      {
        name: 'medium',
        ttl: config().throttler.mediumTTL,
        limit: config().throttler.mediumLIMIT
      },
      {
        name: 'long',
        ttl: config().throttler.longTTL,
        limit: config().throttler.longLIMIT
      }
    ]),
    UserModule,
    ChatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
