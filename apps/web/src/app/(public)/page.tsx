'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, VehicleCard } from '@chatowa/ui';
import { createClient } from '../../lib/supabase/client';
import { IVehicle } from '@chatowa/types';
import { Shield, Sparkles, UserCheck, CreditCard } from 'lucide-react';

export default function HomePage() {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchFeaturedVehicles() {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*, vehicle_images(*)')
          .eq('is_published', true)
          .eq('status', 'available')
          .limit(3);

        if (error) throw error;
        
        // Map to correct casing if necessary, or check fields
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
      } catch (err) {
        console.error('Error fetching featured vehicles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedVehicles();
  }, []);

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-[#E67E22]" />,
      title: 'Fully Insured',
      description: 'All our vehicles come with comprehensive insurance for peace of mind.'
    },
    {
      icon: <Sparkles className="h-8 w-8 text-[#E67E22]" />,
      title: 'Premium Fleet',
      description: 'Meticulously maintained vehicles ensuring comfort and safety.'
    },
    {
      icon: <UserCheck className="h-8 w-8 text-[#E67E22]" />,
      title: 'Professional Drivers',
      description: 'Chauffeur services available upon request for any rental vehicle.'
    },
    {
      icon: <CreditCard className="h-8 w-8 text-[#E67E22]" />,
      title: 'Installment Sales',
      description: 'Flexible payment packages available for vehicle purchases.'
    }
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2C3E50] via-[#1A252F] to-black text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E67E22_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E67E22]/20 text-[#E67E22] border border-[#E67E22]/30">
              Welcome to Chatowa Investments
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Premium Vehicle <span className="text-[#E67E22]">Rentals & Sales</span> in Zambia
            </h1>
            <p className="text-lg sm:text-xl text-[#BDC3C7] font-medium leading-relaxed">
              Explore our range of top-tier SUVs, rugged 4x4s, and efficient sedans. Find your perfect ride for business, travel, or procurement.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rent">
                <Button variant="default" className="px-8 py-4 bg-[#E67E22] hover:bg-[#D35400] text-lg font-semibold shadow-lg shadow-[#E67E22]/20">
                  Browse Rentals
                </Button>
              </Link>
              <Link href="/buy">
                <Button variant="outline" className="px-8 py-4 border-white text-white hover:bg-white/10 text-lg font-semibold">
                  Browse Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">Featured Vehicles</h2>
          <p className="text-[#BDC3C7] max-w-xl mx-auto">Discover the latest arrivals in our fleet available for instant bookings and inspections.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-[400px] shadow-sm border border-[#BDC3C7]/10" />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#BDC3C7]/10 max-w-2xl mx-auto">
            <p className="text-lg font-semibold text-[#2C3E50] mb-4">No vehicles published yet</p>
            <p className="text-[#BDC3C7] mb-6">Our fleet managers are currently listing new vehicles. Check back soon!</p>
            <div className="flex justify-center gap-4">
              <Link href="/rent">
                <Button variant="outline">View All Rentals</Button>
              </Link>
              <Link href="/buy">
                <Button variant="outline">View Sales Catalog</Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white border-y border-[#BDC3C7]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">Why Choose Us</h2>
            <p className="text-[#BDC3C7] max-w-xl mx-auto">We prioritize customer satisfaction, safety, and flexible acquisition paths.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 bg-[#F8F9FA] rounded-2xl border border-[#BDC3C7]/10 hover:shadow-md transition-shadow duration-200">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#BDC3C7] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2C3E50] text-white py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Get Started?</h2>
          <p className="text-[#BDC3C7] max-w-xl mx-auto leading-relaxed">
            Create an account in seconds to manage your rentals, download invoices, track purchase agreements, and sign contracts digitally.
          </p>
          <div className="pt-4">
            <Link href="/register">
              <Button variant="default" className="bg-[#E67E22] hover:bg-[#D35400] px-8 py-3.5 text-lg font-semibold shadow-lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}