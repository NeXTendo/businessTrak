import React, { useState } from 'react';
import { PageHeader, Button, Input, Select, Card, CardContent, CardHeader, CardTitle } from '@chatowa/ui';
import { Save, Building2, Globe, Bell, Shield } from 'lucide-react';

const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-[#E67E22]" />{title}</CardTitle></CardHeader>
    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</CardContent>
  </Card>
);

export default function Settings() {
  const [form, setForm] = useState({
    companyName: 'Chatowa Investments Ltd', companyEmail: 'info@chatowa.com',
    phone: '+260 21 1234567', address: '1 Independence Ave, Lusaka, Zambia',
    currency: 'ZMW', timezone: 'Africa/Lusaka', vatNumber: 'VAT-1234567',
    notifyOverdue: true, notifyPayment: true, notifyMaintenance: true,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="System configuration and preferences"
        actions={<Button className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>} />

      <Section title="Company Information" icon={Building2}>
        <Input label="Company Name" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} />
        <Input label="Email" value={form.companyEmail} onChange={e => setForm(p => ({ ...p, companyEmail: e.target.value }))} />
        <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
        <Input label="VAT Number" value={form.vatNumber} onChange={e => setForm(p => ({ ...p, vatNumber: e.target.value }))} />
        <div className="md:col-span-2">
          <Input label="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
        </div>
      </Section>

      <Section title="Regional & Currency" icon={Globe}>
        <Select label="Default Currency" value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v }))}
          options={[{ label: 'ZMW — Zambian Kwacha', value: 'ZMW' }, { label: 'USD — US Dollar', value: 'USD' }, { label: 'ZAR — South African Rand', value: 'ZAR' }]} />
        <Select label="Timezone" value={form.timezone} onValueChange={v => setForm(p => ({ ...p, timezone: v }))}
          options={[{ label: 'Africa/Lusaka (CAT)', value: 'Africa/Lusaka' }, { label: 'Africa/Johannesburg (SAST)', value: 'Africa/Johannesburg' }]} />
      </Section>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-[#E67E22]" />Notification Preferences</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[
            { key: 'notifyOverdue', label: 'Overdue Rentals', desc: 'Alert when a rental is past its return date' },
            { key: 'notifyPayment', label: 'Payment Received', desc: 'Notify on any incoming payment' },
            { key: 'notifyMaintenance', label: 'Maintenance Due', desc: 'Alert when a vehicle needs servicing' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-[#BDC3C7]/50 p-4 cursor-pointer hover:border-[#E67E22]/50 transition-colors">
              <div>
                <p className="font-medium text-[#2C3E50]">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <div className={`relative h-6 w-11 rounded-full transition-colors ${(form as any)[key] ? 'bg-[#E67E22]' : 'bg-gray-200'}`}
                onClick={() => setForm(p => ({ ...p, [key]: !(p as any)[key] }))}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${(form as any)[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}