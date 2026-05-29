'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, DatePicker } from '@chatowa/ui';
import { createClient } from '../../../../lib/supabase/client';
import { IVehicle } from '@chatowa/types';
import { toast } from 'sonner';
import { ChevronLeft, Info, Calendar, User, Phone, Mail } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function RentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: vehicleId } = use(params);
  const router = useRouter();
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [withDriver, setWithDriver] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchVehicleDetails() {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*, vehicle_images(*)')
          .eq('id', vehicleId)
          .single();

        if (error) throw error;

        const formatted = {
          id: data.id,
          registrationNo: data.registration_no,
          vin: data.vin,
          make: data.make,
          model: data.model,
          year: data.year,
          color: data.color,
          fuelType: data.fuel_type,
          transmission: data.transmission,
          mileage: data.mileage,
          rentalRateDaily: data.rental_rate_daily,
          rentalRateWeekly: data.rental_rate_weekly,
          rentalRateMonthly: data.rental_rate_monthly,
          rentalCurrency: data.rental_currency,
          driverRateDaily: data.driver_rate_daily,
          status: data.status,
          isPublished: data.is_published,
          hasDriverOption: data.has_driver_option,
          features: data.features || [],
          primaryImageUrl: data.vehicle_images?.find((img: any) => img.is_primary)?.url || data.vehicle_images?.[0]?.url || null,
        } as unknown as IVehicle;

        setVehicle(formatted);
        setImages(data.vehicle_images || []);
        setActiveImage(formatted.primaryImageUrl || '/placeholder.png');
      } catch (err) {
        console.error('Error fetching vehicle detail:', err);
        toast.error('Vehicle not found.');
      } finally {
        setLoading(false);
      }
    }

    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setName(profile.full_name || '');
          setPhone(profile.phone || '');
          setEmail(user.email || '');
        }
      }
    }

    fetchVehicleDetails();
    checkAuth();
  }, [vehicleId]);

  // Pricing calculations
  const dailyRate = vehicle?.rentalRateDaily || 0;
  const driverRate = vehicle?.driverRateDaily || 0;
  const currency = vehicle?.rentalCurrency || 'ZMW';

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = differenceInDays(endDate, startDate);
    return diff > 0 ? diff : 1; // Minimum 1 day
  };

  const durationDays = calculateDays();
  const rentalCost = durationDays * dailyRate;
  const driverCost = withDriver ? durationDays * driverRate : 0;
  const totalCost = rentalCost + driverCost;

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Please select start and end dates.');
      return;
    }
    if (!name || !email || !phone) {
      toast.error('Please provide your contact information.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Get or create customer record
      let customerId: string | null = null;
      if (user) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // create customer
          const { data: newCustomer, error: cErr } = await supabase
            .from('customers')
            .insert({
              user_id: user.id,
              full_name: name,
              email: email,
              phone: phone,
            })
            .select('id')
            .single();
          if (cErr) throw cErr;
          customerId = newCustomer.id;
        }
      } else {
        // Guest customer record
        const { data: guestCustomer, error: gErr } = await supabase
          .from('customers')
          .insert({
            full_name: name,
            email: email,
            phone: phone,
          })
          .select('id')
          .single();
        if (gErr) throw gErr;
        customerId = guestCustomer.id;
      }

      // 2. Insert rental inquiry
      const { error: rErr } = await supabase.from('rentals').insert({
        customer_id: customerId,
        vehicle_id: vehicleId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        with_driver: withDriver,
        status: 'inquiry',
        rate_type: 'daily',
        rate_amount: dailyRate,
        currency: currency,
        rate_zmw: dailyRate, // assuming base currency is ZMW
        driver_rate: driverRate,
        total_amount: totalCost,
        balance_due: totalCost,
        special_notes: notes,
      });

      if (rErr) throw rErr;

      toast.success('Inquiry submitted successfully! A manager will review and contact you.');
      router.push('/rent');
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error(err.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-8 w-48 bg-white rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[400px] bg-white rounded-3xl" />
          <div className="h-[400px] bg-white rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Vehicle Not Found</h1>
        <Link href="/rent">
          <Button variant="outline">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link href="/rent" className="inline-flex items-center text-sm font-semibold text-[#BDC3C7] hover:text-[#2C3E50] transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Catalog
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">{vehicle.make} {vehicle.model}</h1>
          <p className="text-[#BDC3C7]">Model Year: {vehicle.year} &bull; Registration: {vehicle.registrationNo}</p>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery + Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-4 rounded-3xl border border-[#BDC3C7]/10 shadow-sm space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                <img
                  src={activeImage || '/placeholder.png'}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.url)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                        activeImage === img.url ? 'border-[#E67E22]' : 'border-transparent'
                      }`}
                    >
                      <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white p-8 rounded-3xl border border-[#BDC3C7]/10 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#2C3E50]">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#BDC3C7]/5">
                  <span className="block text-[#BDC3C7] text-xs font-semibold uppercase">Transmission</span>
                  <span className="block font-bold text-[#2C3E50] mt-1 capitalize">{vehicle.transmission}</span>
                </div>
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#BDC3C7]/5">
                  <span className="block text-[#BDC3C7] text-xs font-semibold uppercase">Fuel Type</span>
                  <span className="block font-bold text-[#2C3E50] mt-1 capitalize">{vehicle.fuelType}</span>
                </div>
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#BDC3C7]/5">
                  <span className="block text-[#BDC3C7] text-xs font-semibold uppercase">Mileage</span>
                  <span className="block font-bold text-[#2C3E50] mt-1">{vehicle.mileage.toLocaleString()} km</span>
                </div>
              </div>

              {/* Features List */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-[#2C3E50] text-sm uppercase tracking-wider">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feat, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#E67E22]/10 text-[#E67E22] text-xs font-semibold rounded-lg">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#BDC3C7]/10 shadow-sm space-y-6">
              <div>
                <span className="text-sm font-semibold text-[#BDC3C7]">Daily Rate</span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-3xl font-extrabold text-[#2C3E50]">{currency} {dailyRate.toLocaleString()}</span>
                  <span className="text-sm text-[#BDC3C7]">/ day</span>
                </div>
              </div>

              <hr className="border-[#BDC3C7]/10" />

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#2C3E50] uppercase">Start Date</label>
                    <DatePicker
                      value={startDate}
                      onChange={(date) => setStartDate(date || undefined)}
                      placeholder="Select Date"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#2C3E50] uppercase">End Date</label>
                    <DatePicker
                      value={endDate}
                      onChange={(date) => setEndDate(date || undefined)}
                      placeholder="Select Date"
                    />
                  </div>
                </div>

                {vehicle.hasDriverOption && (
                  <div className="flex items-center space-x-2 py-2">
                    <input
                      type="checkbox"
                      id="withDriver"
                      checked={withDriver}
                      onChange={(e) => setWithDriver(e.target.checked)}
                      className="rounded text-[#E67E22] focus:ring-[#E67E22] h-4 w-4 border-[#BDC3C7]"
                    />
                    <label htmlFor="withDriver" className="text-sm text-[#2C3E50] font-semibold">
                      Add Professional Driver (+{currency} {driverRate}/day)
                    </label>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-[#2C3E50]">Contact Information</h4>
                  <div className="space-y-2">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                    />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                    />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>

                {/* Estimate block */}
                {durationDays > 0 && (
                  <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#BDC3C7]/5 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Rental ({durationDays} days)</span>
                      <span className="font-semibold">{currency} {rentalCost.toLocaleString()}</span>
                    </div>
                    {withDriver && (
                      <div className="flex justify-between text-xs text-[#BDC3C7]">
                        <span>Driver Charge</span>
                        <span>{currency} {driverCost.toLocaleString()}</span>
                      </div>
                    )}
                    <hr className="border-[#BDC3C7]/10" />
                    <div className="flex justify-between font-bold text-base text-[#2C3E50]">
                      <span>Estimated Total</span>
                      <span>{currency} {totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="default"
                  className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white py-3.5 font-bold shadow-md shadow-[#E67E22]/10"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Inquiry...' : 'Submit Rental Inquiry'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}