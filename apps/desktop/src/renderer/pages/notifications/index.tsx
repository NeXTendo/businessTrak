import React, { useState } from 'react';
import { PageHeader } from '@chatowa/ui';
import { Bell, Car, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';

const mockNotifs = [
  { id: '1', type: 'alert', title: 'Vehicle ABX 1234 overdue', message: 'Expected return was 2 hours ago. Customer: John Doe.', time: '2 hrs ago', read: false },
  { id: '2', type: 'payment', title: 'Payment received — INV-002', message: 'ZMW 58,334 received via Mobile Money from Jane Smith.', time: '5 hrs ago', read: false },
  { id: '3', type: 'maintenance', title: 'BCA 5678 maintenance due', message: 'Vehicle is due for 90,000 km service. Schedule now.', time: 'Yesterday', read: true },
  { id: '4', type: 'payment', title: 'Payment received — INV-001', message: 'ZMW 14,000 received via Bank Transfer from John Doe.', time: '2 days ago', read: true },
  { id: '5', type: 'info', title: 'New customer registered', message: 'Acme Corp Ltd registered on the customer portal.', time: '3 days ago', read: true },
];

const icons: Record<string, React.ReactNode> = {
  alert: <AlertTriangle className="h-5 w-5 text-red-500" />,
  payment: <DollarSign className="h-5 w-5 text-emerald-500" />,
  maintenance: <Car className="h-5 w-5 text-amber-500" />,
  info: <Bell className="h-5 w-5 text-blue-500" />,
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(mockNotifs);
  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Notifications" description="System alerts and activity updates"
        actions={
          <button onClick={markAll} className="text-sm font-medium text-[#E67E22] hover:underline flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Mark all as read
          </button>
        }
      />
      <div className="flex flex-col gap-3">
        {notifs.map(n => (
          <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-all ${n.read ? 'bg-white border-[#BDC3C7]/40' : 'bg-[#E67E22]/5 border-[#E67E22]/30 shadow-sm'}`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.read ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
              {icons[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`font-semibold ${n.read ? 'text-gray-600' : 'text-[#2C3E50]'}`}>{n.title}</p>
                {!n.read && <span className="h-2 w-2 rounded-full bg-[#E67E22] shrink-0 mt-1.5" />}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}