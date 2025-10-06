import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./chat.schema";
import { RedisService } from "src/redis/redis.service";
import { ChatGateway } from "./chat.gateway";
import { QueueModule } from "src/queue/queue.module";

@Module({
    imports:[MongooseModule.forFeature([{name:Chat.name,schema:ChatSchema}]),QueueModule,
    ],
    controllers:[ChatController],
    providers:[ChatService,RedisService,ChatGateway]
})

export class ChatModule{}