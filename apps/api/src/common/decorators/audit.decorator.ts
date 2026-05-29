import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '@chatowa/types';

export const AUDIT_KEY = 'audit';
export const Audit = (action: AuditAction, module: string) => SetMetadata(AUDIT_KEY, { action, module });
