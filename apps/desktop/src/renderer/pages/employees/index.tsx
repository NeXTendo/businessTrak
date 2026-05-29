import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, DataTable } from '@chatowa/ui';
import { Plus } from 'lucide-react';

const mockEmployees = [
  { id: 'e1', name: 'Alice Mwamba', position: 'Driver', department: 'Fleet', phone: '+260 97 1111111', salary: 4500, status: 'active', hiredAt: '2023-01-10' },
  { id: 'e2', name: 'Bob Phiri', position: 'Sales Agent', department: 'Sales', phone: '+260 96 2222222', salary: 5500, status: 'active', hiredAt: '2022-06-01' },
  { id: 'e3', name: 'Carol Tembo', position: 'Accountant', department: 'Finance', phone: '+260 95 3333333', salary: 7000, status: 'active', hiredAt: '2021-03-15' },
  { id: 'e4', name: 'David Banda', position: 'Driver', department: 'Fleet', phone: '+260 97 4444444', salary: 4000, status: 'inactive', hiredAt: '2020-09-20' },
];

export default function EmployeesList() {
  const navigate = useNavigate();
  const columns = [
    { header: 'Employee', accessorKey: 'name', cell: (i: any) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C3E50]/10 text-[#2C3E50] font-bold text-sm">{i.getValue().charAt(0)}</div>
        <div><p className="font-semibold text-[#2C3E50]">{i.getValue()}</p><p className="text-xs text-gray-400">{i.row.original.position}</p></div>
      </div>
    )},
    { header: 'Department', accessorKey: 'department', cell: (i: any) => <span className="capitalize rounded-full bg-[#E67E22]/10 px-2 py-1 text-xs font-medium text-[#E67E22]">{i.getValue()}</span> },
    { header: 'Phone', accessorKey: 'phone' },
    { header: 'Basic Salary', accessorKey: 'salary', cell: (i: any) => <span className="font-semibold">ZMW {i.getValue().toLocaleString()}</span> },
    { header: 'Status', accessorKey: 'status', cell: (i: any) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${i.getValue() === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{i.getValue()}</span>
    )},
  ];
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Employees" description="Manage staff records and payroll information"
        actions={<Button className="gap-2"><Plus className="h-4 w-4" /> Add Employee</Button>} />
      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable data={mockEmployees} columns={columns} searchable onRowClick={r => navigate(`/employees/${r.id}`)} />
      </div>
    </div>
  );
}