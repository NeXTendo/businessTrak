import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle } from '@chatowa/ui';
import { ArrowLeft, Phone, Mail, MapPin, CalendarClock, HandCoins } from 'lucide-react';

const mock = { id: 'c1', name: 'John Doe', phone: '+260 97 1234567', email: 'john@example.com', address: '12 Cairo Road, Lusaka', idNumber: 'NRC-123456/10/1', type: 'individual', totalRentals: 5, totalSpend: 58000, joinedAt: '2024-03-15',
  rentals: [
    { id: 'r1', ref: 'RNT-001', vehicle: 'ABX 1234 — Toyota Hilux', dates: 'Nov 1 – Nov 8, 2025', amount: 14000, status: 'settled' },
    { id: 'r2', ref: 'RNT-002', vehicle: 'CDE 9012 — Nissan Navara', dates: 'Dec 1 – Dec 3, 2025', amount: 6000, status: 'active' },
  ],
};

export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const c = mock;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={c.name} description={`Customer · ${c.type === 'company' ? 'Company' : 'Individual'}`}
        actions={<Button variant="outline" onClick={() => navigate('/customers')}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[{ Icon: Phone, val: c.phone }, { Icon: Mail, val: c.email }, { Icon: MapPin, val: c.address }].map(({ Icon, val }) => (
              <div key={val} className="flex items-center gap-3 text-sm"><Icon className="h-4 w-4 text-[#E67E22] shrink-0" /><span className="text-gray-700">{val}</span></div>
            ))}
            <div className="mt-2 pt-3 border-t border-[#BDC3C7]/40 text-xs text-gray-400">NRC: {c.idNumber} · Member since {c.joinedAt}</div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 xl:grid-cols-2 content-start">
          {[{ label: 'Total Rentals', val: c.totalRentals, Icon: CalendarClock, color: 'text-blue-600' }, { label: 'Total Spend', val: `ZMW ${c.totalSpend.toLocaleString()}`, Icon: HandCoins, color: 'text-emerald-600' }].map(k => (
            <div key={k.label} className="rounded-xl bg-white border border-[#BDC3C7]/60 p-4 shadow-sm">
              <k.Icon className={`h-6 w-6 mb-2 ${k.color}`} />
              <p className="text-xs text-gray-400">{k.label}</p>
              <p className={`text-xl font-bold ${k.color}`}>{k.val}</p>
            </div>
          ))}
        </div>
        <Card className="lg:col-span-1 xl:col-span-0">
          <CardHeader><CardTitle>Rental History</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {c.rentals.map(r => (
              <div key={r.id} className="rounded-lg border border-[#BDC3C7]/40 p-3 cursor-pointer hover:border-[#E67E22]/50 transition-colors" onClick={() => navigate(`/rentals/${r.id}`)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-[#2C3E50]">{r.ref}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${r.status === 'settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{r.status}</span>
                </div>
                <p className="text-xs text-gray-500">{r.vehicle}</p>
                <div className="flex justify-between mt-1"><span className="text-xs text-gray-400">{r.dates}</span><span className="text-xs font-semibold text-[#E67E22]">ZMW {r.amount.toLocaleString()}</span></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
