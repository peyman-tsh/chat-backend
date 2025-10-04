// chat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './chat.schema';
import { CreateChatDto } from './dto/create.chat.dto';
import { UpdateChatDto } from './dto/update.chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const createdChat = await this.chatModel.create(createChatDto);
    return await createdChat.save();
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  async findOne(id: string): Promise<Chat> {
    const chat = await this.chatModel.findById(id).exec();
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async findBySender(senderUserId: string): Promise<Chat[]> {
    return this.chatModel.find({ senderUserId }).exec();
  }

  async findByReceiver(receiverUserId: string): Promise<Chat[]> {
    return this.chatModel.find({ receiverUserId }).exec();
  }

  async findConversation(userId1: string, userId2: string): Promise<Chat[]> {
    return this.chatModel.find({
      $or: [
        { senderUserId: userId1, receiverUserId: userId2 },
        { senderUserId: userId2, receiverUserId: userId1 },
      ],
    })
    .sort({ createdAt: 1 })
    .exec();
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    const updatedChat = await this.chatModel
      .findByIdAndUpdate(id, updateChatDto, { new: true })
      .exec();
    
    if (!updatedChat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    
    return updatedChat;
  }

  async remove(id: string): Promise<Chat> {
    const deletedChat = await this.chatModel.findByIdAndDelete(id).exec();
    
    if (!deletedChat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    
    return deletedChat;
  }
}