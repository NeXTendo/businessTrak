import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from '@chatowa/ui';
import { ArrowLeft, CheckCircle2, DollarSign } from 'lucide-react';

const employees = [
  { id: '1', name: 'Alice Mwamba', position: 'Driver', basic: 4500, allowances: 800, deductions: 450 },
  { id: '2', name: 'Bob Phiri', position: 'Sales Agent', basic: 5500, allowances: 1000, deductions: 550 },
  { id: '3', name: 'Carol Tembo', position: 'Accountant', basic: 7000, allowances: 1500, deductions: 700 },
];

export default function PayrollProcess() {
  const navigate = useNavigate();
  const [month, setMonth] = useState('2025-12');
  const [rows, setRows] = useState(employees.map(e => ({ ...e, bonus: 0, extraDeductions: 0 })));
  const update = (id: string, field: string, val: number) => setRows(r => r.map(e => e.id === id ? { ...e, [field]: val } : e));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Process Payroll" description="Calculate and confirm monthly salaries"
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/payroll')}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
            <Button className="gap-2"><CheckCircle2 className="h-4 w-4" /> Confirm & Disburse</Button>
          </>
        }
      />
      <div className="bg-white rounded-xl border border-[#BDC3C7]/60 p-4 shadow-sm">
        <Input label="Payroll Period" type="month" value={month} onChange={e => setMonth(e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        {rows.map(e => {
          const net = e.basic + e.allowances + e.bonus - e.deductions - e.extraDeductions;
          return (
            <Card key={e.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-[#2C3E50]">{e.name}</p>
                    <p className="text-sm text-gray-500">{e.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Net Pay</p>
                    <p className="text-xl font-bold text-[#E67E22]">ZMW {net.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-lg bg-[#F4F6F7] p-3"><p className="text-xs text-gray-400">Basic</p><p className="font-semibold text-[#2C3E50]">ZMW {e.basic.toLocaleString()}</p></div>
                  <div className="rounded-lg bg-[#F4F6F7] p-3"><p className="text-xs text-gray-400">Allowances</p><p className="font-semibold text-emerald-600">ZMW {e.allowances.toLocaleString()}</p></div>
                  <div className="rounded-lg bg-[#F4F6F7] p-3">
                    <p className="text-xs text-gray-400 mb-1">Bonus</p>
                    <input type="number" className="w-full text-sm font-semibold text-emerald-600 bg-transparent border-b border-[#BDC3C7] focus:outline-none" value={e.bonus} onChange={ev => update(e.id, 'bonus', +ev.target.value)} />
                  </div>
                  <div className="rounded-lg bg-[#F4F6F7] p-3">
                    <p className="text-xs text-gray-400 mb-1">Extra Deductions</p>
                    <input type="number" className="w-full text-sm font-semibold text-red-500 bg-transparent border-b border-[#BDC3C7] focus:outline-none" value={e.extraDeductions} onChange={ev => update(e.id, 'extraDeductions', +ev.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="rounded-xl border border-[#E67E22]/30 bg-[#E67E22]/5 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Payroll for {month}</p>
          <p className="text-2xl font-bold text-[#2C3E50]">ZMW {rows.reduce((s,e) => s + e.basic + e.allowances + e.bonus - e.deductions - e.extraDeductions, 0).toLocaleString()}</p>
        </div>
        <Button className="gap-2 text-base px-6"><DollarSign className="h-5 w-5" /> Disburse All</Button>
      </div>
    </div>
  );
}
