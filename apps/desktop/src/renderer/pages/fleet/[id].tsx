import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Button, Badge, VehicleStatusBadge, Card, CardContent, CardHeader, CardTitle } from '@chatowa/ui';
import { VehicleStatus, FuelType, TransmissionType } from '@chatowa/types';
import { ArrowLeft, Edit, Wrench, Calendar, Shield, Gauge, Fuel, GitMerge } from 'lucide-react';

const mockVehicle = {
  id: '1', registrationNo: 'ABX 1234', make: 'Toyota', model: 'Hilux', year: 2023,
  color: 'White', fuelType: FuelType.DIESEL, transmission: TransmissionType.MANUAL,
  mileage: 15000, seatCapacity: 5, purchasePrice: 850000, purchaseCurrency: 'ZMW',
  rentalRateDaily: 1500, rentalRateWeekly: 9000, rentalRateMonthly: 35000, rentalCurrency: 'ZMW',
  driverRateDaily: 500, status: VehicleStatus.AVAILABLE, isPublished: true,
  hasDriverOption: true, insuranceExpiry: '2027-01-01', roadTaxExpiry: '2026-12-31',
  description: 'Reliable 4x4 pickup with full service history.',
  features: ['4x4', 'Air Conditioning', 'Bluetooth', 'Reverse Camera'],
  acquiredAt: '2023-01-15',
};

export default function FleetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const v = mockVehicle;

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <div className="flex items-center gap-3 py-3 border-b border-[#BDC3C7]/30 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F6F7]">
        <Icon className="h-4 w-4 text-[#E67E22]" />
      </div>
      <div className="flex flex-1 items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-medium text-[#2C3E50]">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${v.make} ${v.model} — ${v.registrationNo}`}
        description={`${v.year} · ${v.color} · ${v.fuelType}`}
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/fleet')}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/fleet/${id}/maintenance`)}>
              <Wrench className="h-4 w-4" /> Maintenance
            </Button>
            <Button className="gap-2" onClick={() => navigate(`/fleet/${id}/edit`)}>
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Card */}
        <Card>
          <CardHeader><CardTitle>Status & Availability</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Status</span>
              <VehicleStatusBadge status={v.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Published</span>
              <Badge variant={v.isPublished ? 'success' : 'neutral'}>{v.isPublished ? 'Yes' : 'No'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Driver Option</span>
              <Badge variant={v.hasDriverOption ? 'info' : 'neutral'}>{v.hasDriverOption ? 'Available' : 'None'}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Specs Card */}
        <Card>
          <CardHeader><CardTitle>Technical Specs</CardTitle></CardHeader>
          <CardContent>
            <InfoRow icon={Gauge} label="Mileage" value={`${v.mileage.toLocaleString()} km`} />
            <InfoRow icon={Fuel} label="Fuel Type" value={v.fuelType} />
            <InfoRow icon={GitMerge} label="Transmission" value={v.transmission} />
            <InfoRow icon={Calendar} label="Acquired" value={v.acquiredAt} />
          </CardContent>
        </Card>

        {/* Compliance Card */}
        <Card>
          <CardHeader><CardTitle>Compliance & Docs</CardTitle></CardHeader>
          <CardContent>
            <InfoRow icon={Shield} label="Insurance Expiry" value={v.insuranceExpiry} />
            <InfoRow icon={Shield} label="Road Tax Expiry" value={v.roadTaxExpiry} />
          </CardContent>
        </Card>
      </div>

      {/* Rental Rates */}
      <Card>
        <CardHeader><CardTitle>Rental Rates</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { label: 'Daily Rate', value: v.rentalRateDaily },
              { label: 'Weekly Rate', value: v.rentalRateWeekly },
              { label: 'Monthly Rate', value: v.rentalRateMonthly },
              { label: 'Driver Rate/Day', value: v.driverRateDaily },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-[#F4F6F7] p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-xl font-bold text-[#2C3E50]">
                  {v.rentalCurrency} {value?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader><CardTitle>Features & Description</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {v.features.map(f => (
              <span key={f} className="rounded-full bg-[#E67E22]/10 px-3 py-1 text-xs font-medium text-[#E67E22]">{f}</span>
            ))}
          </div>
          <p className="text-sm text-gray-600">{v.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
