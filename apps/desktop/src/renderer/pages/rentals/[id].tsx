import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle, RentalStatusBadge } from '@chatowa/ui';
import { ArrowLeft, FileText, CreditCard, ClipboardCheck } from 'lucide-react';
import { RentalStatus } from '@chatowa/types';

const mock = {
  rentalNumber: 'RNT-2025-0042', status: RentalStatus.ACTIVE,
  customer: 'John Doe', vehicle: 'ABX 1234 — Toyota Hilux 2023',
  startDate: '2025-12-01 08:00', endDate: '2025-12-08 17:00', days: 7,
  dailyRate: 1500, driverIncluded: true, driverRateDaily: 500,
  depositPaid: 5000, totalDue: 14000, totalPaid: 5000, balance: 9000,
};

export default function RentalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const r = mock;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Rental ${r.rentalNumber}`}
        description={`${r.customer} · ${r.vehicle}`}
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/rentals')}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/rentals/${id}/inspection`)}>
              <ClipboardCheck className="h-4 w-4" /> Inspection
            </Button>
            <Button className="gap-2"><CreditCard className="h-4 w-4" /> Record Payment</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Rental Info</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { label: 'Status', value: <RentalStatusBadge status={r.status} /> },
              { label: 'Start', value: r.startDate },
              { label: 'Return', value: r.endDate },
              { label: 'Duration', value: `${r.days} days` },
              { label: 'Driver', value: r.driverIncluded ? 'Included' : 'None' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-[#BDC3C7]/30 pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-[#2C3E50]">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { label: 'Vehicle Rate', value: `ZMW ${(r.dailyRate * r.days).toLocaleString()}` },
              { label: 'Driver Cost', value: `ZMW ${(r.driverRateDaily * r.days).toLocaleString()}` },
              { label: 'Total Due', value: `ZMW ${r.totalDue.toLocaleString()}` },
              { label: 'Paid', value: `ZMW ${r.totalPaid.toLocaleString()}` },
              { label: 'Balance', value: `ZMW ${r.balance.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} className={`flex items-center justify-between border-b border-[#BDC3C7]/30 pb-3 last:border-0 last:pb-0 ${label === 'Balance' ? 'font-bold' : ''}`}>
                <span className={`text-sm ${label === 'Balance' ? 'text-red-600' : 'text-gray-500'}`}>{label}</span>
                <span className={`text-sm font-medium ${label === 'Balance' ? 'text-red-600' : 'text-[#2C3E50]'}`}>{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <FileText className="h-4 w-4" /> View Contract
            </Button>
            <Button variant="outline" className="w-full gap-2 justify-start">
              <FileText className="h-4 w-4" /> Print Invoice
            </Button>
            <Button variant="outline" className="w-full gap-2 justify-start text-red-600 border-red-200 hover:bg-red-50">
              Cancel Rental
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
