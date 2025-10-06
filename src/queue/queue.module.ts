import { Module } from "@nestjs/common";
import { BullModule } from '@nestjs/bullmq';
import config from "src/config/config";
import { QueueService } from "./queue.service";
import { ChatGateway } from "src/chat/chat.gateway";
@Module({
    imports:[BullModule.registerQueue({
        name:'sendNotif',
      }),
       BullModule.forRoot({
        connection:{
          host:config().database.bullmq,
          port:config().database.redis_Port
        }
      })],
    controllers:[],
    providers:[QueueService],
    exports:[QueueService,BullModule]
})

export class QueueModule{}