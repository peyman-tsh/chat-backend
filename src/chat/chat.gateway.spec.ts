// chat.gateway.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { RedisService} from '../redis/redis.service';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { CreateChatDto } from './dto/create.chat.dto';

// Mock Socket.IO objects
const mockSocket = {
  id: 'socket-id-1',
  handshake: {
    query: {
      userId: 'user-1',
    },
  },
  disconnect: jest.fn(),
  emit: jest.fn(),
} as unknown as Socket;

const mockServer = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
} as unknown as Server;

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let redisService: RedisService;
  let chatService: ChatService;

  // Mock data
  const mockCreateChatDto: CreateChatDto = {
    sendeUserId: 'user-1',
    ReciveUserId: 'user-2',
    message: 'Hello, how are you?',
  };

  const mockChat = {
    _id: 'chat-id-1',
    senderUserId: 'user-1',
    receiverUserId: 'user-2',
    message: 'Hello, how are you?',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOfflineMessages = [
    'Message',
    "message2"
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: RedisService,
          useValue: {
            setUserOnline: jest.fn().mockResolvedValue(true),
            getOfflineMessages: jest.fn().mockResolvedValue([]),
            deleteOfflineMessages: jest.fn().mockResolvedValue(true),
            getOnlineUser: jest.fn().mockResolvedValue(null),
            saveOfflineMessage: jest.fn().mockResolvedValue(true),
            deleteOnlineUser:jest.fn().mockResolvedValue(null)
          },
        },
        {
          provide: ChatService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockChat),
          },
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    redisService = module.get<RedisService>(RedisService);
    chatService = module.get<ChatService>(ChatService);

    // Mock WebSocketServer
    gateway.server = mockServer;

    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should set user as online when connecting with valid userId', async () => {
      // Act
      await gateway.handleConnection(mockSocket);

      // Assert
      expect(redisService.setUserOnline).toHaveBeenCalledWith('user-1', 'socket-id-1');
      expect(redisService.getOfflineMessages).toHaveBeenCalledWith('user-1');
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('آنلاین شد'));
    });

    it('should disconnect socket when userId is missing', async () => {
      // Arrange
      const socketWithoutUserId = {
        ...mockSocket,
        handshake: { query: {} },
      } as unknown as Socket;

      // Act
      

      // Assert
      await gateway.handleDisconnect(mockSocket)
      expect(redisService.setUserOnline).not.toHaveBeenCalled();
    });

    it('should send offline messages to user when connecting', async () => {
      // Arrange
      jest.spyOn(redisService, 'getOfflineMessages').mockResolvedValue(mockOfflineMessages);

      // Act
      await gateway.handleConnection(mockSocket);

      // Assert
      expect(redisService.getOfflineMessages).toHaveBeenCalledWith('user-1');
      expect(mockSocket.emit).toHaveBeenCalledTimes(2);
      expect(mockSocket.emit).toHaveBeenCalledWith('new_message', mockOfflineMessages[0]);
      expect(mockSocket.emit).toHaveBeenCalledWith('new_message', mockOfflineMessages[1]);
      expect(redisService.deleteOfflineMessages).toHaveBeenCalledWith('user-1');
    });
  });

  describe('handleDisconnect', () => {
    it('should mark user as offline when disconnecting', async () => {
      // Arrange - Setup the online users map with a test user
      const privateOnlineUsers = new Map<string, string>();
      privateOnlineUsers.set('user-1', 'socket-id-1');
      
      // Access private property for testing (not ideal but necessary)
      Object.defineProperty(gateway, 'onlineUsers', {
        value: privateOnlineUsers,
        writable: true,
      });

      // Act
      await gateway.handleDisconnect(mockSocket);

      // Assert
      expect(await redisService.getOnlineUser('user-1')).toBeFalsy();
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('آفلاین شد'));
    });
  });

  describe('handleSendMessage', () => {
    it('should save message and send directly when receiver is online', async () => {
      // Arrange
      jest.spyOn(redisService, 'getOnlineUser').mockResolvedValue('receiver-socket-id');

      // Act
      await gateway.handleSendMessage(mockSocket, mockCreateChatDto);

      // Assert
      expect(chatService.create).toHaveBeenCalledWith(mockCreateChatDto);
      expect(redisService.getOnlineUser).toHaveBeenCalledWith('user-2');
      expect(mockServer.to).toHaveBeenCalledWith('receiver-socket-id');
      expect(mockServer.emit).toHaveBeenCalledWith('new_message', mockCreateChatDto);
      expect(redisService.saveOfflineMessage).not.toHaveBeenCalled();
    });

    it('should save message to Redis when receiver is offline', async () => {
      // Arrange
      jest.spyOn(redisService, 'getOnlineUser').mockResolvedValue(null);

      // Act
      await gateway.handleSendMessage(mockSocket, mockCreateChatDto);

      // Assert
      expect(chatService.create).toHaveBeenCalledWith(mockCreateChatDto);
      expect(redisService.getOnlineUser).toHaveBeenCalledWith('user-2');
      expect(mockServer.to).not.toHaveBeenCalled();
      expect(redisService.saveOfflineMessage).toHaveBeenCalledWith('user-2', mockCreateChatDto.message);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('ذخیره پیام'));
    });
  });
});