import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, DataTable, Tabs } from '@chatowa/ui';
import { Download, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Invoices', href: '/finance/invoices' },
  { label: 'Receipts', href: '/finance/receipts' },
  { label: 'Expenses', href: '/finance/expenses' },
  { label: 'Reports', href: '/finance/reports' },
];

const mockInvoices = [
  { id: 'INV-001', date: '2025-11-01', customer: 'John Doe', type: 'Rental', amount: 14000, status: 'paid' },
  { id: 'INV-002', date: '2025-11-15', customer: 'Jane Smith', type: 'Sale', amount: 850000, status: 'partially_paid' },
  { id: 'INV-003', date: '2025-12-01', customer: 'Bob Johnson', type: 'Rental', amount: 9000, status: 'unpaid' },
];

const statusColors: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700',
  partially_paid: 'bg-amber-100 text-amber-700',
  unpaid: 'bg-red-100 text-red-700',
};

export default function Invoices() {
  const navigate = useNavigate();
  const location = useLocation();

  const columns = [
    { header: 'Invoice #', accessorKey: 'id', cell: (i: any) => <span className="font-mono font-semibold text-[#2C3E50]">{i.getValue()}</span> },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Customer', accessorKey: 'customer' },
    { header: 'Type', accessorKey: 'type' },
    {
      header: 'Amount', accessorKey: 'amount',
      cell: (i: any) => <span className="font-semibold">ZMW {i.getValue().toLocaleString()}</span>,
    },
    {
      header: 'Status', accessorKey: 'status',
      cell: (i: any) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[i.getValue()] ?? ''}`}>
          {i.getValue().replace('_', ' ')}
        </span>
      ),
    },
    {
      header: '', accessorKey: 'id',
      cell: () => (
        <button className="flex items-center gap-1 text-xs text-[#E67E22] hover:underline font-medium">
          <FileText className="h-3.5 w-3.5" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Finance"
        description="Invoices, receipts, expenses and reports"
        actions={<Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>}
      />

      {/* Finance Nav Tabs */}
      <div className="flex gap-1 rounded-xl border border-[#BDC3C7]/60 bg-[#F4F6F7] p-1">
        {tabs.map(t => (
          <button key={t.href} onClick={() => navigate(t.href)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${location.pathname === t.href ? 'bg-white shadow-sm text-[#E67E22]' : 'text-gray-500 hover:text-[#2C3E50]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable data={mockInvoices} columns={columns} searchable emptyMessage="No invoices found." />
      </div>
    </div>
  );
}
