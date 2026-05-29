import React, { useState } from 'react';
import { PageHeader, DataTable } from '@chatowa/ui';
import { Search } from 'lucide-react';

const mockLogs = [
  { id: '1', timestamp: '2025-12-01 09:14:32', user: 'admin@chatowa.com', action: 'CREATE', resource: 'rental', resourceId: 'RNT-001', details: 'Created rental for John Doe' },
  { id: '2', timestamp: '2025-12-01 10:02:11', user: 'admin@chatowa.com', action: 'UPDATE', resource: 'vehicle', resourceId: 'ABX 1234', details: 'Updated status to rented' },
  { id: '3', timestamp: '2025-12-01 14:45:00', user: 'manager@chatowa.com', action: 'CREATE', resource: 'payment', resourceId: 'PAY-019', details: 'Recorded ZMW 14,000 payment' },
  { id: '4', timestamp: '2025-12-02 08:30:22', user: 'admin@chatowa.com', action: 'DELETE', resource: 'expense', resourceId: 'EXP-012', details: 'Deleted duplicate expense entry' },
  { id: '5', timestamp: '2025-12-02 11:00:05', user: 'admin@chatowa.com', action: 'UPDATE', resource: 'employee', resourceId: 'e3', details: 'Updated salary for Carol Tembo' },
];

const actionColors: Record<string, string> = {
  CREATE: 'bg-emerald-100 text-emerald-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function AuditLogs() {
  const columns = [
    { header: 'Timestamp', accessorKey: 'timestamp', cell: (i: any) => <span className="font-mono text-xs text-gray-500">{i.getValue()}</span> },
    { header: 'User', accessorKey: 'user', cell: (i: any) => <span className="text-sm font-medium text-[#2C3E50]">{i.getValue()}</span> },
    { header: 'Action', accessorKey: 'action', cell: (i: any) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${actionColors[i.getValue()] ?? ''}`}>{i.getValue()}</span>
    )},
    { header: 'Resource', accessorKey: 'resource', cell: (i: any) => <span className="capitalize text-sm">{i.getValue()}</span> },
    { header: 'ID', accessorKey: 'resourceId', cell: (i: any) => <span className="font-mono text-xs text-gray-400">{i.getValue()}</span> },
    { header: 'Details', accessorKey: 'details', cell: (i: any) => <span className="text-sm text-gray-600">{i.getValue()}</span> },
  ];
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Audit Logs" description="Full trail of system actions and changes" />
      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable data={mockLogs} columns={columns} searchable emptyMessage="No audit logs found." />
      </div>
    </div>
  );
}