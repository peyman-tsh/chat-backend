import { Module } from "@nestjs/common";
import { BullModule } from '@nestjs/bullmq';
import config from "src/config/config";
import { QueueService } from "./queue.service";
@Module({
    imports:[BullModule.registerQueue({
        name:'sendNotif',
      }),],
    controllers:[],
    providers:[QueueService],
    exports:[QueueService,BullModule]
})

export class QueueModule{}