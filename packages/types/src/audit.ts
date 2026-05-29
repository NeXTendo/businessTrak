import { UserRole, AuditAction } from './enums';

export interface IAuditLog {
  id:          string;
  userId:      string | null;
  userRole:    UserRole | null;
  userName:    string | null;
  action:      AuditAction;
  module:      string;
  recordId:    string | null;
  recordType:  string | null;
  description: string;
  beforeState: Record<string, unknown> | null;
  afterState:  Record<string, unknown> | null;
  ipAddress:   string | null;
  deviceInfo:  string | null;
  createdAt:   string;
}