import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Button, DataTable, Input, Select } from '@chatowa/ui';
import { Download, Plus } from 'lucide-react';

const tabs = [
  { label: 'Invoices', href: '/finance/invoices' },
  { label: 'Receipts', href: '/finance/receipts' },
  { label: 'Expenses', href: '/finance/expenses' },
  { label: 'Reports', href: '/finance/reports' },
];

const categories = ['Fuel', 'Maintenance', 'Insurance', 'Salaries', 'Office', 'Marketing', 'Other'];

const mockExpenses = [
  { id: '1', date: '2025-11-05', description: 'Fuel for ABX 1234', category: 'Fuel', amount: 850, reference: 'FUEL-001', approvedBy: 'Admin' },
  { id: '2', date: '2025-11-08', description: 'Oil change — BCA 5678', category: 'Maintenance', amount: 1200, reference: 'MAINT-002', approvedBy: 'Admin' },
  { id: '3', date: '2025-11-20', description: 'Vehicle insurance premium', category: 'Insurance', amount: 12500, reference: 'INS-2025-Q4', approvedBy: 'Director' },
  { id: '4', date: '2025-12-01', description: 'Staff refreshments', category: 'Office', amount: 450, reference: 'OFF-091', approvedBy: 'Admin' },
];

export default function Expenses() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { header: 'Date', accessorKey: 'date' },
    { header: 'Description', accessorKey: 'description', cell: (i: any) => <span className="font-medium text-[#2C3E50]">{i.getValue()}</span> },
    {
      header: 'Category', accessorKey: 'category',
      cell: (i: any) => (
        <span className="rounded-full bg-[#2C3E50]/10 px-2.5 py-1 text-xs font-semibold text-[#2C3E50]">{i.getValue()}</span>
      ),
    },
    { header: 'Reference', accessorKey: 'reference', cell: (i: any) => <span className="font-mono text-xs text-gray-500">{i.getValue()}</span> },
    { header: 'Amount', accessorKey: 'amount', cell: (i: any) => <span className="font-semibold text-red-600">ZMW {i.getValue().toLocaleString()}</span> },
    { header: 'Approved By', accessorKey: 'approvedBy' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Finance" description="Invoices, receipts, expenses and reports"
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            <Button className="gap-2" onClick={() => setShowForm(v => !v)}><Plus className="h-4 w-4" /> Log Expense</Button>
          </>
        }
      />
      <div className="flex gap-1 rounded-xl border border-[#BDC3C7]/60 bg-[#F4F6F7] p-1">
        {tabs.map(t => (
          <button key={t.href} onClick={() => navigate(t.href)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${location.pathname === t.href ? 'bg-white shadow-sm text-[#E67E22]' : 'text-gray-500 hover:text-[#2C3E50]'}`}
          >{t.label}</button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-[#BDC3C7]/60 shadow-sm p-6">
          <h3 className="font-semibold text-[#2C3E50] mb-4">New Expense</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input label="Description" placeholder="What was purchased?" />
            <Select label="Category" options={categories.map(c => ({ label: c, value: c.toLowerCase() }))} value="" onValueChange={() => {}} />
            <Input label="Amount (ZMW)" type="number" />
            <Input label="Date" type="date" />
            <Input label="Reference / Receipt #" placeholder="e.g. REC-001" />
            <div className="flex items-end gap-3 md:col-span-2 xl:col-span-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="flex-1">Save</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable data={mockExpenses} columns={columns} searchable emptyMessage="No expenses recorded." />
      </div>
    </div>
  );
}
