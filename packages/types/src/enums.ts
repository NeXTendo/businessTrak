export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN       = 'admin',
  MANAGER     = 'manager',
  SALES       = 'sales',
  FLEET_MANAGER = 'fleet_manager',
  FINANCE     = 'finance',
  WORKER      = 'worker',
  CUSTOMER    = 'customer',
}
export enum VehicleStatus {
  AVAILABLE   = 'available',
  RENTED      = 'rented',
  RESERVED    = 'reserved',
  SOLD        = 'sold',
  MAINTENANCE = 'maintenance',
  IN_TRANSIT  = 'in_transit',
}
export enum RentalStatus {
  INQUIRY   = 'inquiry',
  RESERVED  = 'reserved',
  APPROVED  = 'approved',
  ACTIVE    = 'active',
  RETURNED  = 'returned',
  SETTLED   = 'settled',
  CANCELLED = 'cancelled',
}
export enum SaleType {
  CASH         = 'cash',
  FULL_PAYMENT = 'full_payment',
  INSTALLMENT  = 'installment',
  TRADE_IN     = 'trade_in',
}
export enum SaleStatus {
  PENDING   = 'pending',
  ACTIVE    = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
export enum PaymentMethod {
  CASH          = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  AIRTEL_MONEY  = 'airtel_money',
  MTN_MOMO      = 'mtn_momo',
  ZAMTEL_KWACHA = 'zamtel_kwacha',
}
export enum PaymentStatus {
  PENDING   = 'pending',
  CONFIRMED = 'confirmed',
  FAILED    = 'failed',
  REFUNDED  = 'refunded',
}
export enum FuelLevel {
  EMPTY         = 'empty',
  QUARTER       = 'quarter',
  HALF          = 'half',
  THREE_QUARTER = 'three_quarter',
  FULL          = 'full',
}
export enum FuelType {
  PETROL   = 'petrol',
  DIESEL   = 'diesel',
  ELECTRIC = 'electric',
  HYBRID   = 'hybrid',
}
export enum TransmissionType {
  MANUAL    = 'manual',
  AUTOMATIC = 'automatic',
}
export enum ExpenseCategory {
  FUEL        = 'fuel',
  MAINTENANCE = 'maintenance',
  INSURANCE   = 'insurance',
  SALARY      = 'salary',
  UTILITIES   = 'utilities',
  RENT        = 'rent',
  MARKETING   = 'marketing',
  OTHER       = 'other',
}
export enum NotificationType {
  RENTAL_DUE        = 'rental_due',
  RENTAL_OVERDUE    = 'rental_overdue',
  INSURANCE_EXPIRY  = 'insurance_expiry',
  ROAD_TAX_EXPIRY   = 'road_tax_expiry',
  MAINTENANCE_DUE   = 'maintenance_due',
  PAYMENT_PENDING   = 'payment_pending',
  NEW_INQUIRY       = 'new_inquiry',
  BOOKING_CONFIRMED = 'booking_confirmed',
  CONTRACT_READY    = 'contract_ready',
  PAYMENT_RECEIVED  = 'payment_received',
  RETURN_REMINDER   = 'return_reminder',
  GENERAL           = 'general',
}
export enum DocumentType {
  RENTAL_CONTRACT   = 'rental_contract',
  SALE_AGREEMENT    = 'sale_agreement',
  INVOICE           = 'invoice',
  RECEIPT           = 'receipt',
  INSPECTION_REPORT = 'inspection_report',
  PAYSLIP           = 'payslip',
}
export enum AuditAction {
  CREATE    = 'created',
  UPDATE    = 'updated',
  DELETE    = 'deleted',
  CREATED   = 'created',
  UPDATED   = 'updated',
  DELETED   = 'deleted',
  APPROVED  = 'approved',
  REJECTED  = 'rejected',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  GENERATED = 'generated',
  SENT      = 'sent',
  SIGNED    = 'signed',
  LOGIN     = 'login',
  LOGOUT    = 'logout',
  EXPORTED  = 'exported',
}