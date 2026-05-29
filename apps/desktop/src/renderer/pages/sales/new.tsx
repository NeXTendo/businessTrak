import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Input, Select, CurrencyInput, Card, CardContent, CardHeader, CardTitle } from '@chatowa/ui';
import { ArrowLeft, Save, User, Car, DollarSign } from 'lucide-react';

export default function SaleNew() {
  const navigate = useNavigate();
  const [saleType, setSaleType] = useState<'outright' | 'installment'>('outright');
  const [form, setForm] = useState({
    customerId: '', vehicleId: '', salePrice: 0, depositAmount: 0,
    installments: 12, tradeIn: 'no', notes: '',
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New Vehicle Sale"
        description="Record a vehicle sale transaction"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/sales')}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="gap-2"><Save className="h-4 w-4" /> Create Sale</Button>
          </>
        }
      />

      {/* Sale Type Toggle */}
      <div className="flex gap-3">
        {(['outright', 'installment'] as const).map(t => (
          <button key={t} onClick={() => setSaleType(t)}
            className={`flex-1 rounded-xl border-2 py-3 font-semibold transition-all capitalize ${saleType === t ? 'border-[#E67E22] bg-[#E67E22]/10 text-[#E67E22]' : 'border-[#BDC3C7]/60 bg-white text-gray-500'}`}
          >
            {t === 'outright' ? '💰 Outright Purchase' : '📅 Installment Plan'}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-[#E67E22]" />Customer</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select label="Customer" placeholder="Select customer"
            options={[{ label: 'John Doe', value: 'c1' }, { label: 'Jane Smith', value: 'c2' }]}
            value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))} />
          <Select label="Trade-In Vehicle?" options={[{ label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }]}
            value={form.tradeIn} onValueChange={v => setForm(p => ({ ...p, tradeIn: v }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Car className="h-5 w-5 text-[#E67E22]" />Vehicle</CardTitle></CardHeader>
        <CardContent>
          <Select label="Vehicle" placeholder="Select vehicle for sale"
            options={[{ label: 'ABX 1234 — Toyota Hilux 2023', value: 'v1' }, { label: 'BCA 5678 — Ford Ranger 2022', value: 'v2' }]}
            value={form.vehicleId} onValueChange={v => setForm(p => ({ ...p, vehicleId: v }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-[#E67E22]" />Pricing</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <CurrencyInput label="Sale Price" currencyCode="ZMW" value={form.salePrice}
            onChange={v => setForm(p => ({ ...p, salePrice: v ?? 0 }))} />
          <CurrencyInput label="Initial Deposit" currencyCode="ZMW" value={form.depositAmount}
            onChange={v => setForm(p => ({ ...p, depositAmount: v ?? 0 }))} />
          {saleType === 'installment' && (
            <Input label="No. of Installments" type="number" value={form.installments.toString()}
              onChange={e => setForm(p => ({ ...p, installments: +e.target.value }))} />
          )}
        </CardContent>
      </Card>

      {saleType === 'installment' && form.salePrice > 0 && (
        <div className="rounded-xl border border-[#E67E22]/30 bg-[#E67E22]/5 p-5">
          <h3 className="font-semibold text-[#2C3E50] mb-3">Installment Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-xs text-gray-500">Balance After Deposit</p>
              <p className="font-bold text-[#2C3E50] mt-1">ZMW {(form.salePrice - form.depositAmount).toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-xs text-gray-500">Monthly Payment</p>
              <p className="font-bold text-[#E67E22] mt-1">ZMW {form.installments > 0 ? Math.ceil((form.salePrice - form.depositAmount) / form.installments).toLocaleString() : '—'}</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-bold text-[#2C3E50] mt-1">{form.installments} months</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
