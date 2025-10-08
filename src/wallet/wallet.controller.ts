import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Param, 
  Body, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TransferAmountWalletService } from './services/transferAmount.wallet.service';
import { WalletService } from './services/wallet.service';
import { CreateWalletDto } from './dtos/create.wallet.dto';
import { UpdateWalletDto } from './dtos/update.wallet.dto';
import { WalletResponseDto } from './dtos/wallet.response.dto';
import { Wallet } from './wallet.entity';

@ApiTags('api/Wallet')
@Controller('api/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transferWalletService: TransferAmountWalletService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new wallet', description: 'ایجاد کیف پول جدید در سیستم' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully', type: Wallet })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateWalletDto })
  async createWallet(@Body() walletDto: CreateWalletDto): Promise<Wallet> {
    return await this.walletService.createWallet(walletDto);
  }


  @Post('/transfer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test transfer amount', description: 'ارسال درخواست انتقال مبلغ به API خارجی برای تست' })
  @ApiResponse({ status: 200, description: 'Transfer simulated successfully', type: WalletResponseDto })
  @ApiBody({ type: CreateWalletDto })
  async transferAmount(@Body() walletDto: CreateWalletDto): Promise<WalletResponseDto> {
    return await this.transferWalletService.transferAmountWallet(walletDto);
  }


  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update wallet', description: 'بروزرسانی اطلاعات یک کیف پول بر اساس ID' })
  @ApiResponse({ status: 200, description: 'Wallet updated successfully', type: Wallet })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiParam({ name: 'id', description: 'Wallet ID' })
  @ApiBody({ type: UpdateWalletDto })
  async updateWallet(@Param('id') id: string, @Body() walletDto: UpdateWalletDto): Promise<Wallet> {
    return await this.walletService.updateWallet(id, walletDto);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete wallet by ID', description: 'حذف کیف پول از سیستم بر اساس ID' })
  @ApiResponse({ status: 200, description: 'Wallet deleted successfully', type: Wallet })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiParam({ name: 'id', description: 'Wallet ID' })
  async deleteWallet(@Param('id') id: string): Promise<Wallet> {
    return await this.walletService.deleteWalletById(id);
  }

  @Post('/send')
  async postWallet(@Body() data:CreateWalletDto){
    const postWallet=await this.transferWalletService.sendData();
    return postWallet
  }

  @Post('/commit')
  async transactionCommit(){
   const result=await this.transferWalletService.commitTransaction();
   return result
  }
}