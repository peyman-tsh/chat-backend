import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {ThrottlerModule} from "@nestjs/throttler"
import config from './config/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(config().database.mongo_Url),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
