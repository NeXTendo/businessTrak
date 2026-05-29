import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Input, Select, Textarea, CurrencyInput } from '@chatowa/ui';
import { FuelType, TransmissionType, VehicleStatus } from '@chatowa/types';
import { ArrowLeft, Save } from 'lucide-react';

export default function FleetNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    registrationNo: '', make: '', model: '', year: new Date().getFullYear(),
    color: '', fuelType: FuelType.DIESEL, transmission: TransmissionType.MANUAL,
    mileage: 0, seatCapacity: 5, purchasePrice: 0, rentalRateDaily: 0,
    rentalRateWeekly: 0, rentalRateMonthly: 0, description: '',
    insuranceExpiry: '', roadTaxExpiry: '',
  });

  const fuelOptions = Object.values(FuelType).map(v => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }));
  const transmissionOptions = Object.values(TransmissionType).map(v => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }));

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-[#BDC3C7]/60 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#BDC3C7]/40 bg-[#F4F6F7]">
        <h3 className="font-semibold text-[#2C3E50]">{title}</h3>
      </div>
      <div className="p-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add New Vehicle"
        description="Register a new vehicle to the fleet"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/fleet')}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" /> Save Vehicle
            </Button>
          </>
        }
      />

      <Section title="Vehicle Identity">
        <Input label="Registration Number" placeholder="e.g. ABX 1234" value={form.registrationNo}
          onChange={e => setForm(p => ({ ...p, registrationNo: e.target.value }))} required />
        <Input label="Make / Brand" placeholder="e.g. Toyota" value={form.make}
          onChange={e => setForm(p => ({ ...p, make: e.target.value }))} required />
        <Input label="Model" placeholder="e.g. Hilux" value={form.model}
          onChange={e => setForm(p => ({ ...p, model: e.target.value }))} required />
        <Input label="Year" type="number" value={form.year.toString()}
          onChange={e => setForm(p => ({ ...p, year: +e.target.value }))} required />
        <Input label="Color" placeholder="e.g. White" value={form.color}
          onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
        <Input label="Current Mileage (km)" type="number" value={form.mileage.toString()}
          onChange={e => setForm(p => ({ ...p, mileage: +e.target.value }))} />
      </Section>

      <Section title="Technical Specs">
        <Select label="Fuel Type" options={fuelOptions} value={form.fuelType}
          onValueChange={v => setForm(p => ({ ...p, fuelType: v as FuelType }))} />
        <Select label="Transmission" options={transmissionOptions} value={form.transmission}
          onValueChange={v => setForm(p => ({ ...p, transmission: v as TransmissionType }))} />
        <Input label="Seat Capacity" type="number" value={form.seatCapacity.toString()}
          onChange={e => setForm(p => ({ ...p, seatCapacity: +e.target.value }))} />
      </Section>

      <Section title="Rates & Pricing">
        <CurrencyInput label="Purchase Price" currencyCode="ZMW" value={form.purchasePrice}
          onChange={v => setForm(p => ({ ...p, purchasePrice: v ?? 0 }))} />
        <CurrencyInput label="Daily Rental Rate" currencyCode="ZMW" value={form.rentalRateDaily}
          onChange={v => setForm(p => ({ ...p, rentalRateDaily: v ?? 0 }))} />
        <CurrencyInput label="Weekly Rental Rate" currencyCode="ZMW" value={form.rentalRateWeekly}
          onChange={v => setForm(p => ({ ...p, rentalRateWeekly: v ?? 0 }))} />
        <CurrencyInput label="Monthly Rental Rate" currencyCode="ZMW" value={form.rentalRateMonthly}
          onChange={v => setForm(p => ({ ...p, rentalRateMonthly: v ?? 0 }))} />
      </Section>

      <Section title="Documentation & Compliance">
        <Input label="Insurance Expiry" type="date" value={form.insuranceExpiry}
          onChange={e => setForm(p => ({ ...p, insuranceExpiry: e.target.value }))} />
        <Input label="Road Tax Expiry" type="date" value={form.roadTaxExpiry}
          onChange={e => setForm(p => ({ ...p, roadTaxExpiry: e.target.value }))} />
      </Section>

      <div className="bg-white rounded-xl border border-[#BDC3C7]/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#BDC3C7]/40 bg-[#F4F6F7]">
          <h3 className="font-semibold text-[#2C3E50]">Description & Notes</h3>
        </div>
        <div className="p-6">
          <Textarea label="Description" placeholder="Vehicle description, features, notes..."
            value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={4} />
        </div>
      </div>
    </div>
  );
}
