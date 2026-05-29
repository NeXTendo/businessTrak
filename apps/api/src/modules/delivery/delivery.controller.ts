import { Controller } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
@Controller('delivery')
export class DeliveryController { constructor(private readonly svc: DeliveryService) {} }