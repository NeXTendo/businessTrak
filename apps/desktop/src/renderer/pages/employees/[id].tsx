import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle } from '@chatowa/ui';
import { ArrowLeft, Phone, Mail, Briefcase, Calendar, DollarSign } from 'lucide-react';

const mock = { id: 'e1', name: 'Alice Mwamba', position: 'Driver', department: 'Fleet Operations', phone: '+260 97 1111111', email: 'alice@chatowa.com', address: '45 Cha Cha Cha Road, Lusaka', nrc: 'NRC-789012/11/1', hiredAt: '2023-01-10', basic: 4500, allowances: 800, deductions: 450, net: 4850,
  payHistory: [
    { month: 'November 2025', net: 4850, status: 'paid' },
    { month: 'October 2025', net: 4850, status: 'paid' },
    { month: 'September 2025', net: 4600, status: 'paid' },
  ],
};

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const e = mock;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={e.name} description={`${e.position} · ${e.department}`}
        actions={<Button variant="outline" onClick={() => navigate('/employees')}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[{ Icon: Phone, val: e.phone }, { Icon: Mail, val: e.email }, { Icon: Briefcase, val: e.department }, { Icon: Calendar, val: `Hired: ${e.hiredAt}` }].map(({ Icon, val }) => (
              <div key={val} className="flex items-center gap-3 text-sm"><Icon className="h-4 w-4 text-[#E67E22] shrink-0" /><span className="text-gray-700">{val}</span></div>
            ))}
            <div className="mt-2 pt-3 border-t border-[#BDC3C7]/40 text-xs text-gray-400">NRC: {e.nrc}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Salary Breakdown</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { label: 'Basic Salary', val: e.basic, color: 'text-[#2C3E50]' },
              { label: 'Allowances', val: e.allowances, color: 'text-emerald-600' },
              { label: 'Deductions', val: -e.deductions, color: 'text-red-500' },
              { label: 'Net Pay', val: e.net, color: 'text-[#E67E22] font-bold text-base' },
            ].map(r => (
              <div key={r.label} className={`flex justify-between border-b border-[#BDC3C7]/30 pb-2 last:border-0 ${r.label === 'Net Pay' ? 'mt-1 pt-1' : ''}`}>
                <span className="text-sm text-gray-500">{r.label}</span>
                <span className={`text-sm ${r.color}`}>ZMW {Math.abs(r.val).toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pay History</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {e.payHistory.map(p => (
              <div key={p.month} className="flex items-center justify-between rounded-lg border border-[#BDC3C7]/40 p-3">
                <div>
                  <p className="text-sm font-medium text-[#2C3E50]">{p.month}</p>
                  <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 font-medium">{p.status}</span>
                </div>
                <span className="font-bold text-[#E67E22]">ZMW {p.net.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
