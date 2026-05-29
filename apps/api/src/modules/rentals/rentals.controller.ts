import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto, createRentalSchema } from './dto/create-rental.dto';
import { UpdateRentalDto, updateRentalSchema } from './dto/update-rental.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UserRole, AuditAction } from '@chatowa/types';

@Controller('rentals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES)
  @Audit(AuditAction.CREATE, 'Rentals')
  @UsePipes(new ZodValidationPipe(createRentalSchema))
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES, UserRole.FLEET_MANAGER)
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES, UserRole.FLEET_MANAGER)
  findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES)
  @Audit(AuditAction.UPDATE, 'Rentals')
  @UsePipes(new ZodValidationPipe(updateRentalSchema))
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
    return this.rentalsService.update(id, updateRentalDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @Audit(AuditAction.DELETE, 'Rentals')
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(id);
  }
}