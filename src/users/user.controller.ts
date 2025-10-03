import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create.user.dto";
import { User } from "./user.schema";
import {ApiTags,ApiBody,ApiCreatedResponse
    ,ApiNotFoundResponse,ApiFoundResponse, 
    ApiQuery,ApiParam,ApiOkResponse,
    ApiOperation
    }from "@nestjs/swagger";
import { UpdateUserDto } from "./dtos/update.user.dto";

@Controller('api/users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/create')
    @ApiOperation({ summary: 'create User' })
    @ApiCreatedResponse({ description: 'The record has been successfully created.',type:User})
    @ApiNotFoundResponse({ description: 'not found.'})
    @ApiBody({type: CreateUserDto})
    async createUser(@Body() user: CreateUserDto): Promise<User> {
        return await this.userService.createUser(user);
    };

    @Get('/findByEmail')
    @ApiOperation({ summary: 'find a user by Email' })
    @ApiFoundResponse({description:'found user',type:User})
    @ApiNotFoundResponse({description:'not found'})
    @ApiQuery({
        name: 'email',
        type: String,
        description: 'Email address of the user to find',
        required: true,
        example: 'user@example.com'
      })
      @ApiFoundResponse({
        description: 'User found successfully',
        type: User // اینجا می‌توانید نوع پاسخ را مشخص کنید
      })
    async findUserByEmail(@Query() query:{email:string}):Promise<User>{
      return await this.userService.findUserByEmail(query.email);
    };

    @Get('/findUserById/:id')
    @ApiOperation({ summary: 'find a user by ID' })
    @ApiFoundResponse({description:'found user',type:User})
    @ApiNotFoundResponse({description:'not found'})
    @ApiParam({
        name:'id',
        type:String,
        description:'find user by userId'
    })
    async findUserById(@Param('id') id:string):Promise<User>{
      return await this.userService.findUserById(id);
    };

    @Put(':id')
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiParam({ name: 'id', description: 'User ID', type: String })
    @ApiBody({ type: UpdateUserDto })
    @ApiOkResponse({ description: 'User updated successfully', type: User })
    @ApiNotFoundResponse({ description: 'User not found' })
    async updateUser(
      @Param('id') id: string,
      @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
      return await this.userService.updateUser(id, updateUserDto);
    };

    @Delete(':id')
    @ApiOperation({ summary: 'delete a user by ID' })
    @ApiParam({name:'id' , description:'user Id' , type:String})
    @ApiOkResponse({ description: 'User deleted successfully', type: String })
    @ApiNotFoundResponse({ description: 'User not found' })
    async deleteUser(@Param('id') id:string):Promise<string>{
      return await this.userService.deleteUser(id);
    };

    @Get('/getAllUsers')
    @ApiOperation({summary:"get all users"})
    @ApiFoundResponse({description:'users found',type:User})
    @ApiNotFoundResponse({ description: 'User not found' })
    async findAllUsers():Promise<User[]>{
       return await this.userService.findAllUsers();
    };

   @Get('/findByPhoneNumber') 
   @ApiOperation({summary:'find by mobile'})
   @ApiBody({type:String})
   @ApiFoundResponse({description:'users found',type:User})
   @ApiNotFoundResponse({ description: 'User not found' })
   async findByPhoneNumber(@Body() phoneNumber:string):Promise<User>{
      return await this.userService.findUserByPhoneNumber(phoneNumber);
   };

}
 