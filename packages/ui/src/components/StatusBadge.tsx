import React from 'react';
import { VehicleStatus, RentalStatus, SaleStatus, PaymentStatus } from '@chatowa/types';
import { Badge } from './Badge';
import type { BadgeProps } from './Badge';

const vehicleStatusMap: Record<VehicleStatus, { label: string; variant: BadgeProps['variant'] }> = {
  available:   { label: 'Available',     variant: 'success' },
  rented:      { label: 'Rented',        variant: 'info' },
  reserved:    { label: 'Reserved',      variant: 'warning' },
  sold:        { label: 'Sold',          variant: 'neutral' },
  maintenance: { label: 'Maintenance',   variant: 'danger' },
  in_transit:  { label: 'In Transit',    variant: 'warning' },
};

const rentalStatusMap: Record<RentalStatus, { label: string; variant: BadgeProps['variant'] }> = {
  inquiry:   { label: 'Inquiry',   variant: 'neutral' },
  reserved:  { label: 'Reserved',  variant: 'info' },
  approved:  { label: 'Approved',  variant: 'warning' },
  active:    { label: 'Active',    variant: 'success' },
  returned:  { label: 'Returned',  variant: 'neutral' },
  settled:   { label: 'Settled',   variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

const saleStatusMap: Record<SaleStatus, { label: string; variant: BadgeProps['variant'] }> = {
  pending:   { label: 'Pending',   variant: 'warning' },
  active:    { label: 'Active',    variant: 'info' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

const paymentStatusMap: Record<PaymentStatus, { label: string; variant: BadgeProps['variant'] }> = {
  pending:   { label: 'Pending',   variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  failed:    { label: 'Failed',    variant: 'danger' },
  refunded:  { label: 'Refunded',  variant: 'neutral' },
};

export const VehicleStatusBadge: React.FC<{ status: VehicleStatus }> = ({ status }) => {
  const cfg = vehicleStatusMap[status] ?? { label: status, variant: 'neutral' as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

export const RentalStatusBadge: React.FC<{ status: RentalStatus }> = ({ status }) => {
  const cfg = rentalStatusMap[status] ?? { label: status, variant: 'neutral' as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

export const SaleStatusBadge: React.FC<{ status: SaleStatus }> = ({ status }) => {
  const cfg = saleStatusMap[status] ?? { label: status, variant: 'neutral' as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const cfg = paymentStatusMap[status] ?? { label: status, variant: 'neutral' as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

// Generic status badge
export const StatusBadge: React.FC<{ status: string; variant?: BadgeProps['variant'] }> = ({ status, variant = 'neutral' }) => (
  <Badge variant={variant}>{status}</Badge>
);