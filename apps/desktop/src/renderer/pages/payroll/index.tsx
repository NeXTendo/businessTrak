import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle, DataTable } from '@chatowa/ui';
import { Plus, DollarSign, CheckCircle2 } from 'lucide-react';

const mockPayroll = [
  { id: '1', employee: 'Alice Mwamba', position: 'Driver', department: 'Fleet', basicSalary: 4500, allowances: 800, deductions: 450, netPay: 4850, month: 'November 2025', status: 'processed' },
  { id: '2', employee: 'Bob Phiri', position: 'Sales Agent', department: 'Sales', basicSalary: 5500, allowances: 1000, deductions: 550, netPay: 5950, month: 'November 2025', status: 'processed' },
  { id: '3', employee: 'Carol Tembo', position: 'Accountant', department: 'Finance', basicSalary: 7000, allowances: 1500, deductions: 700, netPay: 7800, month: 'November 2025', status: 'pending' },
];

export default function PayrollList() {
  const navigate = useNavigate();
  const columns = [
    { header: 'Employee', accessorKey: 'employee', cell: (i: any) => <span className="font-semibold text-[#2C3E50]">{i.getValue()}</span> },
    { header: 'Position', accessorKey: 'position' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Basic', accessorKey: 'basicSalary', cell: (i: any) => `ZMW ${i.getValue().toLocaleString()}` },
    { header: 'Net Pay', accessorKey: 'netPay', cell: (i: any) => <span className="font-bold text-[#E67E22]">ZMW {i.getValue().toLocaleString()}</span> },
    { header: 'Status', accessorKey: 'status', cell: (i: any) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${i.getValue() === 'processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        {i.getValue().charAt(0).toUpperCase() + i.getValue().slice(1)}
      </span>
    )},
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Payroll" description="Employee salary processing and history"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/payroll/process')}>
              <DollarSign className="h-4 w-4" /> Process Payroll
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Payroll (Nov)', val: 'ZMW 18,600', color: 'text-[#E67E22]' }, { label: 'Employees Paid', val: '2 / 3', color: 'text-emerald-600' }, { label: 'Pending', val: 'ZMW 7,800', color: 'text-amber-600' }].map(k => (
          <div key={k.label} className="rounded-xl bg-white border border-[#BDC3C7]/60 p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500">{k.label}</p>
            <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.val}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable data={mockPayroll} columns={columns} searchable />
      </div>
    </div>
  );
}