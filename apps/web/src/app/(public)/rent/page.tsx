'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Select, VehicleCard } from '@chatowa/ui';
import { createClient } from '../../../lib/supabase/client';
import { IVehicle } from '@chatowa/types';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function RentCatalogPage() {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [transmission, setTransmission] = useState('all');
  const [fuelType, setFuelType] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    async function fetchRentals() {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*, vehicle_images(*)')
          .eq('is_published', true)
          .eq('status', 'available');

        if (error) throw error;

        const formatted = (data || []).map((v: any) => ({
          id: v.id,
          registrationNo: v.registration_no,
          vin: v.vin,
          make: v.make,
          model: v.model,
          year: v.year,
          color: v.color,
          fuelType: v.fuel_type,
          transmission: v.transmission,
          mileage: v.mileage,
          rentalRateDaily: v.rental_rate_daily,
          rentalRateWeekly: v.rental_rate_weekly,
          rentalRateMonthly: v.rental_rate_monthly,
          rentalCurrency: v.rental_currency,
          driverRateDaily: v.driver_rate_daily,
          status: v.status,
          isPublished: v.is_published,
          hasDriverOption: v.has_driver_option,
          primaryImageUrl: v.vehicle_images?.find((img: any) => img.is_primary)?.url || v.vehicle_images?.[0]?.url || null,
        } as unknown as IVehicle));

        setVehicles(formatted);
        setFilteredVehicles(formatted);
      } catch (err) {
        console.error('Error fetching rentals:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRentals();
  }, []);

  useEffect(() => {
    let result = [...vehicles];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.year.toString().includes(q)
      );
    }

    if (transmission !== 'all') {
      result = result.filter((v) => v.transmission === transmission);
    }

    if (fuelType !== 'all') {
      result = result.filter((v) => v.fuelType === fuelType);
    }

    setFilteredVehicles(result);
  }, [search, transmission, fuelType, vehicles]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">Rent a Vehicle</h1>
          <p className="text-[#BDC3C7]">Choose from our daily, weekly, or monthly premium rentals.</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#BDC3C7]/10 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-[#BDC3C7]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, or year..."
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-44">
              <Select
                value={transmission}
                onValueChange={(val) => setTransmission(val)}
                options={[
                  { label: 'All Transmissions', value: 'all' },
                  { label: 'Automatic', value: 'automatic' },
                  { label: 'Manual', value: 'manual' }
                ]}
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                value={fuelType}
                onValueChange={(val) => setFuelType(val)}
                options={[
                  { label: 'All Fuel Types', value: 'all' },
                  { label: 'Petrol', value: 'petrol' },
                  { label: 'Diesel', value: 'diesel' },
                  { label: 'Hybrid', value: 'hybrid' },
                  { label: 'Electric', value: 'electric' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-[400px] shadow-sm border border-[#BDC3C7]/10" />
            ))}
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#BDC3C7]/10 max-w-2xl mx-auto">
            <SlidersHorizontal className="h-12 w-12 text-[#BDC3C7] mx-auto mb-4" />
            <p className="text-lg font-semibold text-[#2C3E50] mb-2">No matching vehicles found</p>
            <p className="text-[#BDC3C7]">Try refining your search terms or adjusting the filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}