import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

import { AuthModule }          from './modules/auth/auth.module';
import { FleetModule }         from './modules/fleet/fleet.module';
import { RentalsModule }       from './modules/rentals/rentals.module';
import { SalesModule }         from './modules/sales/sales.module';
import { FinanceModule }       from './modules/finance/finance.module';
import { PayrollModule }       from './modules/payroll/payroll.module';
import { CustomersModule }     from './modules/customers/customers.module';
import { EmployeesModule }     from './modules/employees/employees.module';
import { DocumentsModule }     from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DeliveryModule }      from './modules/delivery/delivery.module';
import { AuditModule }         from './modules/audit/audit.module';
import { CurrenciesModule }    from './modules/currencies/currencies.module';
import { StorageModule }       from './modules/storage/storage.module';
import { SettingsModule }      from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    AuthModule, FleetModule, RentalsModule, SalesModule, FinanceModule,
    PayrollModule, CustomersModule, EmployeesModule, DocumentsModule,
    NotificationsModule, DeliveryModule, AuditModule,
    CurrenciesModule, StorageModule, SettingsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}