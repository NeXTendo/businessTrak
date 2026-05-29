import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, DataTable } from '@chatowa/ui';
import { Plus, UserCircle } from 'lucide-react';

const mockCustomers = [
  { id: 'c1', name: 'John Doe', phone: '+260 97 1234567', email: 'john@example.com', type: 'individual', totalRentals: 5, totalSpend: 58000, status: 'active' },
  { id: 'c2', name: 'Jane Smith', phone: '+260 96 7654321', email: 'jane@example.com', type: 'individual', totalRentals: 2, totalSpend: 21000, status: 'active' },
  { id: 'c3', name: 'Acme Corp Ltd', phone: '+260 21 3456789', email: 'info@acme.zm', type: 'company', totalRentals: 12, totalSpend: 195000, status: 'active' },
];

export default function CustomersList() {
  const navigate = useNavigate();
  const columns = [
    { header: 'Customer', accessorKey: 'name', cell: (i: any) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E67E22]/15 text-[#E67E22] font-bold text-sm">{i.getValue().charAt(0)}</div>
        <div><p className="font-semibold text-[#2C3E50]">{i.getValue()}</p><p className="text-xs text-gray-400">{i.row.original.email}</p></div>
      </div>
    )},
    { header: 'Phone', accessorKey: 'phone' },
    { header: 'Type', accessorKey: 'type', cell: (i: any) => <span className="capitalize rounded-full bg-[#2C3E50]/10 px-2 py-1 text-xs font-medium">{i.getValue()}</span> },
    { header: 'Rentals', accessorKey: 'totalRentals', cell: (i: any) => <span className="font-semibold">{i.getValue()}</span> },
    { header: 'Total Spend', accessorKey: 'totalSpend', cell: (i: any) => <span className="font-semibold text-emerald-600">ZMW {i.getValue().toLocaleString()}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Customers" description="Manage customer profiles and rental history"
        actions={<Button className="gap-2"><Plus className="h-4 w-4" /> Add Customer</Button>} />
      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable data={mockCustomers} columns={columns} searchable onRowClick={r => navigate(`/customers/${r.id}`)} />
      </div>
    </div>
  );
}