import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, createSaleSchema } from './dto/create-sale.dto';
import { UpdateSaleDto, updateSaleSchema } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UserRole, AuditAction } from '@chatowa/types';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES)
  @Audit(AuditAction.CREATE, 'Sales')
  @UsePipes(new ZodValidationPipe(createSaleSchema))
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES)
  @Audit(AuditAction.UPDATE, 'Sales')
  @UsePipes(new ZodValidationPipe(updateSaleSchema))
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @Audit(AuditAction.DELETE, 'Sales')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}