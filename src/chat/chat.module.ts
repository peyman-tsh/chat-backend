import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./chat.schema";
import { RedisService } from "src/redis/redis.service";

@Module({
    imports:[MongooseModule.forFeature([{name:Chat.name,schema:ChatSchema}])],
    controllers:[ChatController],
    providers:[ChatService,RedisService]
})

export class ChatModule{}