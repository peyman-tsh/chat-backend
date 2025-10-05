import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./chat.schema";
import { RedisService } from "src/redis/redis.service";
import { ChatGateway } from "./chat.gateway";
import { QueueModule } from "src/queue/queue.module";
import { BullModule } from "@nestjs/bullmq";
import config from "src/config/config";
import { QueueService } from "src/queue/queue.service";

@Module({
    imports:[MongooseModule.forFeature([{name:Chat.name,schema:ChatSchema}]),QueueModule,
    ],
    controllers:[ChatController],
    providers:[ChatService,RedisService,ChatGateway]
})

export class ChatModule{}