-- ============================================================
-- Migration 002: Enums
-- All custom PostgreSQL enum types used across the schema.
-- Must run before any table creation.
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'finance',
  'worker',
  'customer'
);

CREATE TYPE vehicle_status AS ENUM (
  'available',
  'rented',
  'reserved',
  'sold',
  'maintenance',
  'in_transit'
);

CREATE TYPE fuel_type AS ENUM (
  'petrol',
  'diesel',
  'electric',
  'hybrid'
);

CREATE TYPE transmission_type AS ENUM (
  'manual',
  'automatic'
);

CREATE TYPE fuel_level AS ENUM (
  'empty',
  'quarter',
  'half',
  'three_quarter',
  'full'
);

CREATE TYPE rental_status AS ENUM (
  'inquiry',
  'reserved',
  'approved',
  'active',
  'returned',
  'settled',
  'cancelled'
);

CREATE TYPE sale_type AS ENUM (
  'full_payment',
  'installment',
  'trade_in'
);

CREATE TYPE sale_status AS ENUM (
  'pending',
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE payment_method AS ENUM (
  'cash',
  'bank_transfer',
  'airtel_money',
  'mtn_momo',
  'zamtel_kwacha'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'confirmed',
  'failed',
  'refunded'
);

CREATE TYPE document_type AS ENUM (
  'rental_contract',
  'sale_agreement',
  'invoice',
  'receipt',
  'inspection_report',
  'payslip'
);

CREATE TYPE signature_method AS ENUM (
  'physical',
  'digital'
);

CREATE TYPE inspection_type AS ENUM (
  'pre_rental',
  'post_rental'
);

CREATE TYPE notification_type AS ENUM (
  'rental_due',
  'rental_overdue',
  'insurance_expiry',
  'road_tax_expiry',
  'maintenance_due',
  'payment_pending',
  'new_inquiry',
  'booking_confirmed',
  'contract_ready',
  'payment_received',
  'return_reminder',
  'general'
);

CREATE TYPE expense_category AS ENUM (
  'fuel',
  'maintenance',
  'insurance',
  'salary',
  'utilities',
  'rent',
  'marketing',
  'other'
);

CREATE TYPE vehicle_timeline_event AS ENUM (
  'purchased',
  'listed',
  'reserved',
  'rented',
  'returned',
  'maintenance_started',
  'maintenance_completed',
  'damaged',
  'repaired',
  'sold',
  'published',
  'unpublished',
  'status_changed'
);

CREATE TYPE audit_action AS ENUM (
  'created',
  'updated',
  'deleted',
  'approved',
  'rejected',
  'confirmed',
  'cancelled',
  'generated',
  'sent',
  'signed',
  'login',
  'logout',
  'exported'
);
