import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  HttpStatus,
  HttpCode 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiResponse, 
  ApiOperation, 
  ApiParam, 
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse 
} from '@nestjs/swagger';
import { FactorService } from './factor.service';
import { CreateFactorDto } from './dtos/add.factor.dto';
import { UpdateFactorDto } from './dtos/update.factor.dto';
import { Factor } from './factor.entity';

@ApiTags('Factors Management')
@Controller('factors')
export class FactorController {
  constructor(private readonly factorService: FactorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'ایجاد فاکتور جدید', 
    description: 'یک فاکتور جدید با وضعیت‌های پرداخت، تکمیل و رد شدن ایجاد می‌کند' 
  })
  @ApiBody({ 
    type: CreateFactorDto,
    description: 'اطلاعات فاکتور جدید',
    examples: {
      example1: {
        summary: 'نمونه فاکتور',
        value: {
          paymentStatus: 'COMPLETED',
          doneStatus: 'DONE',
          rejectedStatus: 'NOTREJECT',
          userId: '507f1f77bcf86cd799439011'
        }
      }
    }
  })
  @ApiCreatedResponse({ 
    description: 'فاکتور با موفقیت ایجاد شد', 
    type: Factor 
  })
  @ApiBadRequestResponse({ 
    description: 'داده‌های ورودی نامعتبر' 
  })
  async addFactor(@Body() factorDto: CreateFactorDto): Promise<Factor> {
    return this.factorService.addFactor(factorDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'دریافت فاکتور با شناسه', 
    description: 'یک فاکتور خاص را با استفاده از شناسه MongoDB دریافت می‌کند' 
  })
  @ApiParam({ 
    name: 'id', 
    example: '507f1f77bcf86cd799439011', 
    description: 'شناسه MongoDB فاکتور',
    type: 'string'
  })
  @ApiOkResponse({ 
    description: 'فاکتور پیدا شد', 
    type: Factor 
  })
  @ApiNotFoundResponse({  
    description: 'فاکتور پیدا نشد',
    schema: {
      example: {
        statusCode: 404,
        message: 'factor not found',
        error: 'Not Found'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'شناسه نامعتبر' 
  })
  async getFactor(@Param('id') id: string): Promise<Factor> {
    return this.factorService.getFactor(id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'دریافت تمام فاکتورها', 
    description: 'لیست تمام فاکتورهای موجود در سیستم را دریافت می‌کند' 
  })
  @ApiOkResponse({  
    description: 'لیست تمام فاکتورها', 
    type: [Factor],
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439011',
          paymentStatus: 'COMPLETED',
          doneStatus: 'DONE',
          rejectedStatus: 'NOTREJECT',
          userId: '507f1f77bcf86cd799439012'
        }
      ]
    }
  })
  async getFactors(): Promise<Factor[]> {
    return this.factorService.getFactors();
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'بروزرسانی فاکتور', 
    description: 'یک فاکتور را با استفاده از شناسه MongoDB بروزرسانی می‌کند. بروزرسانی جزئی مجاز است' 
  })
  @ApiParam({ 
    name: 'id', 
    example: '507f1f77bcf86cd799439011', 
    description: 'شناسه MongoDB فاکتور',
    type: 'string'
  })
  @ApiBody({ 
    type: UpdateFactorDto,
    description: 'اطلاعات بروزرسانی فاکتور (همه فیلدها اختیاری)',
    examples: {
      partialUpdate: {
        summary: 'بروزرسانی جزئی',
        value: {
          paymentStatus: 'PENDING'
        }
      },
      fullUpdate: {
        summary: 'بروزرسانی کامل',
        value: {
          paymentStatus: 'COMPLETED',
          doneStatus: 'DONE',
          rejectedStatus: 'NOTREJECT'
        }
      }
    }
  })
  @ApiOkResponse({  
    description: 'فاکتور با موفقیت بروزرسانی شد', 
    type: Factor 
  })
  @ApiNotFoundResponse({ 
    description: 'فاکتور پیدا نشد' 
  })
  @ApiBadRequestResponse({ 
    description: 'داده‌های ورودی یا شناسه نامعتبر' 
  })
  async updateFactor(
    @Param('id') id: string, 
    @Body() factorDto: UpdateFactorDto
  ): Promise<Factor | null> {
    return this.factorService.updateFactor(id, factorDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'حذف فاکتور', 
    description: 'یک فاکتور را به طور دائم با استفاده از شناسه MongoDB حذف می‌کند' 
  })
  @ApiParam({ 
    name: 'id', 
    example: '507f1f77bcf86cd799439011', 
    description: 'شناسه MongoDB فاکتور',
    type: 'string'
  })
  @ApiOkResponse({  
    description: 'فاکتور با موفقیت حذف شد', 
    type: Factor,
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        paymentStatus: 'COMPLETED',
        doneStatus: 'DONE',
        rejectedStatus: 'NOTREJECT',
        userId: '507f1f77bcf86cd799439012'
      }
    }
  })
  @ApiNotFoundResponse({  
    description: 'فاکتور پیدا نشد یا حذف نشد',
    schema: {
      example: {
        statusCode: 404,
        message: 'dont deleted',
        error: 'Not Found'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'شناسه نامعتبر' 
  })
  async deleteFactor(@Param('id') id: string): Promise<Factor> {
    return this.factorService.deleteFactor(id);
  }
}