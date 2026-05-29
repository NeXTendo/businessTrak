import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle } from '@chatowa/ui';
import { Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const tabs = [
  { label: 'Invoices', href: '/finance/invoices' },
  { label: 'Receipts', href: '/finance/receipts' },
  { label: 'Expenses', href: '/finance/expenses' },
  { label: 'Reports', href: '/finance/reports' },
];

const monthlyData = [
  { month: 'Jul', revenue: 32000, expenses: 12000 },
  { month: 'Aug', revenue: 41000, expenses: 14000 },
  { month: 'Sep', revenue: 38000, expenses: 11000 },
  { month: 'Oct', revenue: 52000, expenses: 16000 },
  { month: 'Nov', revenue: 47000, expenses: 13000 },
  { month: 'Dec', revenue: 61000, expenses: 18000 },
];

const revenueBreakdown = [
  { name: 'Rentals', value: 62, color: '#E67E22' },
  { name: 'Sales', value: 30, color: '#2C3E50' },
  { name: 'Other', value: 8, color: '#BDC3C7' },
];

export default function Reports() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Finance" description="Invoices, receipts, expenses and reports"
        actions={<Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export PDF</Button>} />
      <div className="flex gap-1 rounded-xl border border-[#BDC3C7]/60 bg-[#F4F6F7] p-1">
        {tabs.map(t => (
          <button key={t.href} onClick={() => navigate(t.href)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${location.pathname === t.href ? 'bg-white shadow-sm text-[#E67E22]' : 'text-gray-500 hover:text-[#2C3E50]'}`}
          >{t.label}</button>
        ))}
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[{ label: 'Total Revenue', val: 'ZMW 271k', color: 'text-emerald-600' }, { label: 'Total Expenses', val: 'ZMW 84k', color: 'text-red-600' }, { label: 'Net Profit', val: 'ZMW 187k', color: 'text-[#E67E22]' }, { label: 'Profit Margin', val: '69%', color: 'text-blue-600' }].map(k => (
          <div key={k.label} className="rounded-xl bg-white border border-[#BDC3C7]/60 p-4 text-center shadow-sm">
            <p className="text-xs text-gray-500">{k.label}</p>
            <p className={`text-xl font-bold mt-1 ${k.color}`}>{k.val}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Revenue vs Expenses (6 months)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip formatter={(v: number) => `ZMW ${v.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#E67E22" radius={[4,4,0,0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="#2C3E50" radius={[4,4,0,0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                    {revenueBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
