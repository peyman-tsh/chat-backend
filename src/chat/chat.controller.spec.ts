// chat.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create.chat.dto';
import { UpdateChatDto } from './dto/update.chat.dto';
import { NotFoundException } from '@nestjs/common';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  // Mock chat data
  const mockChat = {
    _id: 'chat-id-1',
    senderUserId: 'user-1',
    receiverUserId: 'user-2',
    message: 'Hello, how are you?',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockChats = [
    mockChat,
    {
      _id: 'chat-id-2',
      senderUserId: 'user-2',
      receiverUserId: 'user-1',
      message: 'I am good, thanks!',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Mock DTOs
  const createChatDto: CreateChatDto = {
    sendeUserId: 'user-1',
    ReciveUserId: 'user-2',
    message: 'Hello, how are you?',
  };

  const updateChatDto: UpdateChatDto = {
    message: 'Updated message',
  };

  beforeEach(async () => {
    // Create a mock service with all methods used by the controller
    const mockChatService = {
      create: jest.fn().mockResolvedValue(mockChat),
      findAll: jest.fn().mockResolvedValue(mockChats),
      findOne: jest.fn().mockImplementation((id) => {
        if (id === 'chat-id-1') {
          return Promise.resolve(mockChat);
        }
        return Promise.reject(new NotFoundException(`Chat with ID ${id} not found`));
      }),
      findBySender: jest.fn().mockResolvedValue([mockChat]),
      findByReceiver: jest.fn().mockResolvedValue([mockChats[1]]),
      findConversation: jest.fn().mockResolvedValue(mockChats),
      update: jest.fn().mockImplementation((id, dto) => {
        if (id === 'chat-id-1') {
          return Promise.resolve({ ...mockChat, ...dto });
        }
        return Promise.reject(new NotFoundException(`Chat with ID ${id} not found`));
      }),
      remove: jest.fn().mockImplementation((id) => {
        if (id === 'chat-id-1') {
          return Promise.resolve(mockChat);
        }
        return Promise.reject(new NotFoundException(`Chat with ID ${id} not found`));
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new chat message', async () => {
      const result = await controller.create(createChatDto);
      
      expect(result).toEqual(mockChat);
      expect(service.create).toHaveBeenCalledWith(createChatDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of chat messages', async () => {
      const result = await controller.findAll();
      
      expect(result).toEqual(mockChats);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findConversation', () => {
    it('should return conversation between two users', async () => {
      const userId1 = 'user-1';
      const userId2 = 'user-2';
      
      const result = await controller.findConversation(userId1, userId2);
      
      expect(result).toEqual(mockChats);
      expect(service.findConversation).toHaveBeenCalledWith(userId1, userId2);
    });
  });

  describe('findBySender', () => {
    it('should return messages sent by a specific user', async () => {
      const senderUserId = 'user-1';
      
      const result = await controller.findBySender(senderUserId);
      
      expect(result).toEqual([mockChat]);
      expect(service.findBySender).toHaveBeenCalledWith(senderUserId);
    });
  });

  describe('findByReceiver', () => {
    it('should return messages received by a specific user', async () => {
      const receiverUserId = 'user-1';
      
      const result = await controller.findByReceiver(receiverUserId);
      
      expect(result).toEqual([mockChats[1]]);
      expect(service.findByReceiver).toHaveBeenCalledWith(receiverUserId);
    });
  });

  describe('findOne', () => {
    it('should return a chat message by ID', async () => {
      const id = 'chat-id-1';
      
      const result = await controller.findOne(id);
      
      expect(result).toEqual(mockChat);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when chat not found', async () => {
      const id = 'non-existent-id';
      
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a chat message', async () => {
      const id = 'chat-id-1';
      const expectedResult = { ...mockChat, ...updateChatDto };
      
      const result = await controller.update(id, updateChatDto);
      
      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateChatDto);
    });

    it('should throw NotFoundException when chat not found', async () => {
      const id = 'non-existent-id';
      
      await expect(controller.update(id, updateChatDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(id, updateChatDto);
    });
  });

  describe('remove', () => {
    it('should delete a chat message', async () => {
      const id = 'chat-id-1';
      
      const result = await controller.remove(id);
      
      expect(result).toEqual(mockChat);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when chat not found', async () => {
      const id = 'non-existent-id';
      
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});