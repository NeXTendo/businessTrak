'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Textarea } from '@chatowa/ui';
import { createClient } from '../../../../lib/supabase/client';
import { IVehicle } from '@chatowa/types';
import { toast } from 'sonner';
import { ChevronLeft, Info, Landmark, Calendar, User, Phone, Mail } from 'lucide-react';

export default function BuyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: vehicleId } = use(params);
  const router = useRouter();
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [saleType, setSaleType] = useState<'full_payment' | 'installment'>('full_payment');
  const [installmentCount, setInstallmentCount] = useState('6');
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
          sellingPrice: data.selling_price,
          sellingCurrency: data.selling_currency,
          status: data.status,
          isPublished: data.is_published,
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

  const sellingPrice = vehicle?.sellingPrice || 0;
  const currency = vehicle?.sellingCurrency || 'ZMW';

  // Estimate calculations
  const downPaymentPercent = 30; // 30% downpayment
  const downPaymentAmount = sellingPrice * (downPaymentPercent / 100);
  const remainingBalance = sellingPrice - downPaymentAmount;
  const monthlyInstallment = remainingBalance / parseInt(installmentCount);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // 2. Insert sales inquiry
      const { error: sErr } = await supabase.from('sales').insert({
        customer_id: customerId,
        vehicle_id: vehicleId,
        sale_type: saleType,
        sale_status: 'pending',
        asking_price: sellingPrice,
        agreed_price: sellingPrice,
        currency: currency,
        agreed_price_zmw: sellingPrice, // assuming base currency is ZMW
        down_payment: saleType === 'installment' ? downPaymentAmount : sellingPrice,
        installment_count: saleType === 'installment' ? parseInt(installmentCount) : null,
        installment_amount: saleType === 'installment' ? monthlyInstallment : null,
        installment_interval: saleType === 'installment' ? 'monthly' : null,
        balance_due: saleType === 'installment' ? remainingBalance : 0,
        special_notes: notes,
      });

      if (sErr) throw sErr;

      toast.success('Sales inquiry submitted! Our acquisitions agent will review and contact you.');
      router.push('/buy');
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error(err.message || 'Failed to submit sales offer.');
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
        <Link href="/buy">
          <Button variant="outline">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link href="/buy" className="inline-flex items-center text-sm font-semibold text-[#BDC3C7] hover:text-[#2C3E50] transition-colors">
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
                <span className="text-sm font-semibold text-[#BDC3C7]">Selling Price</span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-3xl font-extrabold text-[#2C3E50]">{currency} {sellingPrice.toLocaleString()}</span>
                </div>
              </div>

              <hr className="border-[#BDC3C7]/10" />

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#2C3E50] uppercase">Payment Mode</label>
                  <Select
                    value={saleType}
                    onValueChange={(val) => setSaleType(val as any)}
                    options={[
                      { label: 'Outright Cash Purchase', value: 'full_payment' },
                      { label: 'Installment Purchase Plan', value: 'installment' }
                    ]}
                  />
                </div>

                {saleType === 'installment' && (
                  <div className="space-y-2 p-4 bg-[#F8F9FA] rounded-2xl border border-[#BDC3C7]/10">
                    <label className="block text-xs font-bold text-[#2C3E50] uppercase mb-1">Installment Duration</label>
                    <Select
                      value={installmentCount}
                      onValueChange={(val) => setInstallmentCount(val)}
                      options={[
                        { label: '3 Months Plan', value: '3' },
                        { label: '6 Months Plan', value: '6' },
                        { label: '12 Months Plan', value: '12' }
                      ]}
                    />
                    <div className="text-xs text-[#BDC3C7] space-y-2 mt-4">
                      <div className="flex justify-between">
                        <span>Down Payment ({downPaymentPercent}%)</span>
                        <span className="font-semibold text-[#2C3E50]">{currency} {downPaymentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Installment</span>
                        <span className="font-semibold text-[#2C3E50]">{currency} {monthlyInstallment.toLocaleString()}</span>
                      </div>
                    </div>
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

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#2C3E50] uppercase">Proposed Offer / Message</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any custom comments or questions about your purchase offer..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full bg-[#E67E22] hover:bg-[#D35400] text-[#FFFFFF] py-3.5 font-bold shadow-md shadow-[#E67E22]/10"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Offer...' : 'Submit Purchase Inquiry'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}