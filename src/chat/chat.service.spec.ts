// chat.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { Chat } from './chat.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create.chat.dto';
import { UpdateChatDto } from './dto/update.chat.dto';

describe('ChatService', () => {
  let service: ChatService;
  let model: Model<Chat>;

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
    // Create mock model with all methods used by the service
    const mockModel = {
      new: jest.fn().mockResolvedValue(mockChat),
      create: jest.fn().mockResolvedValue(mockChat),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Chat.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    model = module.get<Model<Chat>>(getModelToken(Chat.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a new chat message', async () => {
      // Arrange
      const saveSpy = jest.fn().mockResolvedValue(mockChat);
      jest.spyOn(model, 'create').mockImplementation(() => ({
        ...createChatDto,
        save: saveSpy,
      } as any));

      // Act
      const result = await service.create(createChatDto);

      // Assert
      expect(result).toEqual(mockChat);
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of chat messages', async () => {
      // Arrange
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChats),
      } as any);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockChats);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a chat message by ID', async () => {
      // Arrange
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChat),
      } as any);

      // Act
      const result = await service.findOne('chat-id-1');

      // Assert
      expect(result).toEqual(mockChat);
      expect(model.findById).toHaveBeenCalledWith('chat-id-1');
    });

    it('should throw NotFoundException when chat not found', async () => {
      // Arrange
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Act & Assert
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('findBySender', () => {
    it('should return messages sent by a specific user', async () => {
      // Arrange
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockChat]),
      } as any);

      // Act
      const result = await service.findBySender('user-1');

      // Assert
      expect(result).toEqual([mockChat]);
      expect(model.find).toHaveBeenCalledWith({ senderUserId: 'user-1' });
    });
  });

  describe('findByReceiver', () => {
    it('should return messages received by a specific user', async () => {
      // Arrange
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockChats[1]]),
      } as any);

      // Act
      const result = await service.findByReceiver('user-1');

      // Assert
      expect(result).toEqual([mockChats[1]]);
      expect(model.find).toHaveBeenCalledWith({ receiverUserId: 'user-1' });
    });
  });

  describe('findConversation', () => {
    it('should return conversation between two users', async () => {
      // Arrange
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockChats),
        }),
      } as any);

      // Act
      const result = await service.findConversation('user-1', 'user-2');

      // Assert
      expect(result).toEqual(mockChats);
      expect(model.find).toHaveBeenCalledWith({
        $or: [
          { senderUserId: 'user-1', receiverUserId: 'user-2' },
          { senderUserId: 'user-2', receiverUserId: 'user-1' },
        ],
      });
    });
  });

  describe('update', () => {
    it('should update and return a chat message', async () => {
      // Arrange
      const updatedChat = { ...mockChat, ...updateChatDto };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedChat),
      } as any);

      // Act
      const result = await service.update('chat-id-1', updateChatDto);

      // Assert
      expect(result).toEqual(updatedChat);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'chat-id-1',
        updateChatDto,
        { new: true },
      );
    });

    it('should throw NotFoundException when chat not found', async () => {
      // Arrange
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Act & Assert
      await expect(
        service.update('non-existent-id', updateChatDto),
      ).rejects.toThrow(NotFoundException);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'non-existent-id',
        updateChatDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should delete and return a chat message', async () => {
      // Arrange
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChat),
      } as any);

      // Act
      const result = await service.remove('chat-id-1');

      // Assert
      expect(result).toEqual(mockChat);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('chat-id-1');
    });

    it('should throw NotFoundException when chat not found', async () => {
      // Arrange
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Act & Assert
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});