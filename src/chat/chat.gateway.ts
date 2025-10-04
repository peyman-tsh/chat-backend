// chat.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { RedisService } from '../redis/redis.service';
  import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create.chat.dto';

  @WebSocketGateway({ cors: {
    origin: '*', // همه دامین‌ها مجازند
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: false
  } })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private onlineUsers = new Map<string, string>(); // userId -> socketId
  
    constructor(private redisService: RedisService,private readonly chatService:ChatService) {}
  
    async handleConnection(socket: Socket) {
      const userId = socket.handshake.query.userId as string;
  
      if (!userId) {
        socket.disconnect();
        return;
      }
  
      await this.redisService.setUserOnline(userId, socket.id);
      console.log(`✅ کاربر ${userId} آنلاین شد`);
  
      // وقتی وصل شد پیام‌های آفلاین رو بهش بده
      const offlineMessages = await this.redisService.getOfflineMessages(userId);
      if (offlineMessages.length > 0) {
        offlineMessages.forEach(msg => {
          socket.emit('new_message', msg);
        });
        await this.redisService.deleteOfflineMessages(userId);
      }
    }
  
    async handleDisconnect(socket: Socket) {
        const userId = socket.handshake.query.userId as string;
      
        if (!userId) return;
      
        await this.redisService.deleteOnlineUer(userId);
        console.log(`📴 کاربر ${userId} آفلاین شد`);
      }
  
    @SubscribeMessage('send_message')
    async handleSendMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: CreateChatDto) {
      const createMessage = await this.chatService.create(data)
      const receiverSocketId=await this.redisService.getOnlineUser(data.ReciveUserId);
      console.log(data);
      
      if (receiverSocketId) {
        // گیرنده آنلاین → پیام را مستقیم بده
        this.server.to(receiverSocketId).emit('new_message', data);
      } else {
        // آفلاین → ذخیره در Redis
        console.log(`💾 ذخیره پیام برای گیرنده ${data.ReciveUserId}`);
        await this.redisService.saveOfflineMessage(data.ReciveUserId, data.message);
      }
    }
  }