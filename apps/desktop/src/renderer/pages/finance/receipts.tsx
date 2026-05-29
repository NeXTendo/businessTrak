import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Button, DataTable } from '@chatowa/ui';
import { Download, Printer } from 'lucide-react';

const tabs = [
  { label: 'Invoices', href: '/finance/invoices' },
  { label: 'Receipts', href: '/finance/receipts' },
  { label: 'Expenses', href: '/finance/expenses' },
  { label: 'Reports', href: '/finance/reports' },
];

const mockReceipts = [
  { id: 'REC-001', date: '2025-11-02', customer: 'John Doe', ref: 'INV-001', amount: 14000, method: 'Bank Transfer' },
  { id: 'REC-002', date: '2025-11-16', customer: 'Jane Smith', ref: 'INV-002', amount: 150000, method: 'Cash' },
  { id: 'REC-003', date: '2025-12-02', customer: 'Bob Johnson', ref: 'INV-003', amount: 4500, method: 'Mobile Money' },
];

export default function Receipts() {
  const navigate = useNavigate();
  const location = useLocation();

  const columns = [
    { header: 'Receipt #', accessorKey: 'id', cell: (i: any) => <span className="font-mono font-semibold text-[#2C3E50]">{i.getValue()}</span> },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Customer', accessorKey: 'customer' },
    { header: 'Invoice Ref', accessorKey: 'ref', cell: (i: any) => <span className="font-mono text-gray-500">{i.getValue()}</span> },
    { header: 'Method', accessorKey: 'method' },
    { header: 'Amount', accessorKey: 'amount', cell: (i: any) => <span className="font-semibold text-emerald-600">ZMW {i.getValue().toLocaleString()}</span> },
    {
      header: '', accessorKey: 'id',
      cell: () => (
        <button className="flex items-center gap-1 text-xs text-[#E67E22] hover:underline font-medium">
          <Printer className="h-3.5 w-3.5" /> Print
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Finance" description="Invoices, receipts, expenses and reports"
        actions={<Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>} />
      <div className="flex gap-1 rounded-xl border border-[#BDC3C7]/60 bg-[#F4F6F7] p-1">
        {tabs.map(t => (
          <button key={t.href} onClick={() => navigate(t.href)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${location.pathname === t.href ? 'bg-white shadow-sm text-[#E67E22]' : 'text-gray-500 hover:text-[#2C3E50]'}`}
          >{t.label}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable data={mockReceipts} columns={columns} searchable emptyMessage="No receipts found." />
      </div>
    </div>
  );
}
