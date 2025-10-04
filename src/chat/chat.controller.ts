// chat.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus,
  } from '@nestjs/common';
  import { ChatService } from './chat.service';
  import { CreateChatDto } from './dto/create.chat.dto';
  import { UpdateChatDto } from './dto/update.chat.dto';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
  } from '@nestjs/swagger';
  import { Chat } from './chat.schema';
  
  @ApiTags('chat')
  @Controller('chat')
  export class ChatController {
    constructor(private readonly chatService: ChatService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new chat message' })
    @ApiBody({ type: CreateChatDto })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'The chat message has been successfully created.',
      type: Chat,
    })
    create(@Body() createChatDto: CreateChatDto) {
      return this.chatService.create(createChatDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all chat messages' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns all chat messages',
      type: [Chat],
    })
    findAll() {
      return this.chatService.findAll();
    }
  
    @Get('conversation')
    @ApiOperation({ summary: 'Get conversation between two users' })
    @ApiQuery({ name: 'userId1', description: 'First user ID' })
    @ApiQuery({ name: 'userId2', description: 'Second user ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns conversation between two users',
      type: [Chat],
    })
    findConversation(
      @Query('userId1') userId1: string,
      @Query('userId2') userId2: string,
    ) {
      return this.chatService.findConversation(userId1, userId2);
    }
  
    @Get('sender/:senderUserId')
    @ApiOperation({ summary: 'Get messages sent by a specific user' })
    @ApiParam({ name: 'senderUserId', description: 'Sender user ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns messages sent by the specified user',
      type: [Chat],
    })
    findBySender(@Param('senderUserId') senderUserId: string) {
      return this.chatService.findBySender(senderUserId);
    }
  
    @Get('receiver/:receiverUserId')
    @ApiOperation({ summary: 'Get messages received by a specific user' })
    @ApiParam({ name: 'receiverUserId', description: 'Receiver user ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns messages received by the specified user',
      type: [Chat],
    })
    findByReceiver(@Param('receiverUserId') receiverUserId: string) {
      return this.chatService.findByReceiver(receiverUserId);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a chat message by ID' })
    @ApiParam({ name: 'id', description: 'Chat message ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns the chat message',
      type: Chat,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Chat message not found',
    })
    findOne(@Param('id') id: string) {
      return this.chatService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a chat message' })
    @ApiParam({ name: 'id', description: 'Chat message ID' })
    @ApiBody({ type: UpdateChatDto })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'The chat message has been successfully updated.',
      type: Chat,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Chat message not found',
    })
    update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
      return this.chatService.update(id, updateChatDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a chat message' })
    @ApiParam({ name: 'id', description: 'Chat message ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'The chat message has been successfully deleted.',
      type: Chat,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Chat message not found',
    })
    remove(@Param('id') id: string) {
      return this.chatService.remove(id);
    }
  }