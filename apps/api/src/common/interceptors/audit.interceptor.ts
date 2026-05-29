import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUDIT_KEY } from '../decorators/audit.decorator';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMeta = this.reflector.get<{ action: string; module: string }>(
      AUDIT_KEY,
      context.getHandler(),
    );

    if (!auditMeta) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;

    return next.handle().pipe(
      tap(async (data) => {
        if (user) {
          try {
            await this.supabase.from('audit_logs').insert({
              user_id: user.id,
              action: auditMeta.action,
              module: auditMeta.module,
              record_id: data?.id || body?.id || request.params.id,
              details: {
                requestBody: body,
                response: data,
                ip: request.ip,
                userAgent: request.headers['user-agent']
              }
            });
          } catch (error) {
            console.error('Failed to write audit log:', error);
          }
        }
      }),
    );
  }
}