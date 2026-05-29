import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Input, Select, CurrencyInput, Card, CardContent, CardHeader, CardTitle } from '@chatowa/ui';
import { ArrowLeft, Save, User, Car, Calendar } from 'lucide-react';

export default function RentalNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerId: '', vehicleId: '', startDate: '', endDate: '',
    withDriver: 'no', depositAmount: 0, notes: '',
  });

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#E67E22]" />{title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Rental"
        description="Create a new vehicle rental agreement"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/rentals')}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="gap-2"><Save className="h-4 w-4" /> Create Rental</Button>
          </>
        }
      />

      <Section title="Customer" icon={User}>
        <Select label="Customer" options={[{ label: 'John Doe', value: 'c1' }, { label: 'Jane Smith', value: 'c2' }]}
          value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))} placeholder="Select customer" />
      </Section>

      <Section title="Vehicle & Dates" icon={Car}>
        <Select label="Vehicle" options={[{ label: 'ABX 1234 — Toyota Hilux', value: 'v1' }, { label: 'CDE 9012 — Nissan Navara', value: 'v2' }]}
          value={form.vehicleId} onValueChange={v => setForm(p => ({ ...p, vehicleId: v }))} placeholder="Select vehicle" />
        <Input label="Start Date & Time" type="datetime-local" value={form.startDate}
          onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
        <Input label="End Date & Time" type="datetime-local" value={form.endDate}
          onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
        <Select label="Include Driver?" options={[{ label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }]}
          value={form.withDriver} onValueChange={v => setForm(p => ({ ...p, withDriver: v }))} />
      </Section>

      <Section title="Financial Details" icon={Calendar}>
        <CurrencyInput label="Security Deposit" currencyCode="ZMW" value={form.depositAmount}
          onChange={v => setForm(p => ({ ...p, depositAmount: v ?? 0 }))} />
        <div className="md:col-span-2 xl:col-span-3">
          <Input label="Notes / Special Conditions" placeholder="Any special terms or notes..." />
        </div>
      </Section>

      {/* Estimated Summary */}
      <div className="rounded-xl border border-[#E67E22]/30 bg-[#E67E22]/5 p-5">
        <h3 className="font-semibold text-[#2C3E50] mb-3">Estimated Cost Summary</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[{ label: 'Duration', val: '— days' }, { label: 'Vehicle Rate', val: 'ZMW —' }, { label: 'Driver Cost', val: 'ZMW —' }, { label: 'Total', val: 'ZMW —' }].map(({ label, val }) => (
            <div key={label} className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-bold text-[#2C3E50] mt-1">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
