import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { FleetService } from './fleet.service';
import { CreateVehicleDto, createVehicleSchema } from './dto/create-vehicle.dto';
import { UpdateVehicleDto, updateVehicleSchema } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UserRole, AuditAction } from '@chatowa/types';

@Controller('fleet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Audit(AuditAction.CREATE, 'Fleet')
  @UsePipes(new ZodValidationPipe(createVehicleSchema))
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.fleetService.create(createVehicleDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES, UserRole.FLEET_MANAGER)
  findAll() {
    return this.fleetService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SALES, UserRole.FLEET_MANAGER)
  findOne(@Param('id') id: string) {
    return this.fleetService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.FLEET_MANAGER)
  @Audit(AuditAction.UPDATE, 'Fleet')
  @UsePipes(new ZodValidationPipe(updateVehicleSchema))
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.fleetService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @Audit(AuditAction.DELETE, 'Fleet')
  remove(@Param('id') id: string) {
    return this.fleetService.remove(id);
  }
}