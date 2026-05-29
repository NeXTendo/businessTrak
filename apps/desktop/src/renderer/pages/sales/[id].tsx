import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle, SaleStatusBadge, PaymentStatusBadge } from '@chatowa/ui';
import { ArrowLeft, CreditCard, FileText, CheckCircle2 } from 'lucide-react';
import { SaleStatus, PaymentStatus } from '@chatowa/types';

const mock = {
  saleNumber: 'SAL-2025-0018', status: SaleStatus.ACTIVE,
  customer: 'John Doe', vehicle: 'ABX 1234 — Toyota Hilux 2023',
  saleType: 'installment', salePrice: 850000, depositPaid: 150000,
  balance: 700000, installments: 12, paidInstallments: 2,
  payments: [
    { id: '1', date: '2025-10-01', amount: 150000, status: PaymentStatus.CONFIRMED, method: 'Bank Transfer', ref: 'BT-0019281' },
    { id: '2', date: '2025-11-01', amount: 58334, status: PaymentStatus.CONFIRMED, method: 'Mobile Money', ref: 'MM-9912' },
    { id: '3', date: '2025-12-01', amount: 58334, status: PaymentStatus.PENDING, method: '—', ref: '—' },
  ],
};

export default function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const s = mock;

  const monthlyAmount = Math.ceil(s.balance / s.installments);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Sale ${s.saleNumber}`}
        description={`${s.customer} · ${s.vehicle}`}
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/sales')}><ArrowLeft className="h-4 w-4" /> Back</Button>
            <Button className="gap-2"><CreditCard className="h-4 w-4" /> Record Payment</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Sale Info</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { label: 'Status', value: <SaleStatusBadge status={s.status} /> },
              { label: 'Type', value: s.saleType === 'installment' ? '📅 Installment' : '💰 Outright' },
              { label: 'Sale Price', value: `ZMW ${s.salePrice.toLocaleString()}` },
              { label: 'Deposit Paid', value: `ZMW ${s.depositPaid.toLocaleString()}` },
              { label: 'Installments', value: `${s.paidInstallments}/${s.installments} paid` },
              { label: 'Monthly', value: `ZMW ${monthlyAmount.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-[#BDC3C7]/30 pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-[#2C3E50]">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {s.payments.map(p => (
                <div key={p.id} className="flex items-center gap-4 rounded-xl border border-[#BDC3C7]/40 p-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${p.status === PaymentStatus.CONFIRMED ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#2C3E50]">ZMW {p.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{p.date} · {p.method}{p.ref !== '—' ? ` · Ref: ${p.ref}` : ''}</p>
                  </div>
                  <PaymentStatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Balance */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-red-600 font-medium">Outstanding Balance</p>
          <p className="text-2xl font-bold text-red-700">ZMW {s.balance.toLocaleString()}</p>
        </div>
        <Button className="gap-2 bg-red-600 hover:bg-red-700"><CreditCard className="h-4 w-4" /> Record Payment</Button>
      </div>
    </div>
  );
}
