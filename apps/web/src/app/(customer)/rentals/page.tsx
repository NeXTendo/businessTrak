'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/client';
import { Card, Badge, Button } from '@chatowa/ui';
import { Car, Calendar, DollarSign, ShieldAlert, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [selectedRental, setSelectedRental] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadRentals() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (customer) {
          const { data: rentalsData, error } = await supabase
            .from('rentals')
            .select('*, vehicles(*), rental_payments(*), rental_contracts(*)')
            .eq('customer_id', customer.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setRentals(rentalsData || []);
          if (rentalsData && rentalsData.length > 0) {
            setSelectedRental(rentalsData[0]);
          }
        }
      } catch (err) {
        console.error('Error loading rentals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRentals();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-white rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 h-[400px] bg-white rounded-3xl animate-pulse" />
          <div className="lg:col-span-2 h-[400px] bg-white rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">My Rentals</h1>
        <p className="text-[#BDC3C7]">Track your rental history, contracts, and outstanding balances.</p>
      </div>

      {rentals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List - Left Side */}
          <div className="lg:col-span-4 space-y-4">
            {rentals.map((r) => {
              const isSelected = selectedRental?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRental(r)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#E67E22] bg-[#E67E22]/5 shadow-sm'
                      : 'border-[#BDC3C7]/15 bg-white hover:border-[#E67E22]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#BDC3C7]">{r.rental_number}</span>
                    <Badge variant={r.status === 'active' ? 'success' : 'neutral'} className="capitalize">
                      {r.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#2C3E50]">{r.vehicles?.make} {r.vehicles?.model}</h3>
                  <div className="flex items-center space-x-2 text-xs text-[#BDC3C7] mt-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{r.start_date} to {r.end_date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details - Right Side */}
          <div className="lg:col-span-8">
            {selectedRental && (
              <Card className="p-8 border border-[#BDC3C7]/10 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#BDC3C7]/10 pb-6">
                  <div>
                    <span className="text-xs font-bold text-[#BDC3C7] uppercase tracking-wider">Rental details</span>
                    <h2 className="text-2xl font-extrabold text-[#2C3E50] mt-1">
                      {selectedRental.vehicles?.make} {selectedRental.vehicles?.model}
                    </h2>
                  </div>
                  <Badge variant={selectedRental.status === 'active' ? 'success' : 'neutral'} className="text-sm capitalize py-1 px-3">
                    {selectedRental.status}
                  </Badge>
                </div>

                {/* Main details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                  {/* Left Specs */}
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Rental No.</span>
                      <span className="font-bold text-[#2C3E50]">{selectedRental.rental_number}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Duration</span>
                      <span className="font-bold text-[#2C3E50]">{selectedRental.start_date} to {selectedRental.end_date}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Daily Rate</span>
                      <span className="font-bold text-[#2C3E50]">
                        {selectedRental.currency} {selectedRental.rate_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Driver Option</span>
                      <span className="font-bold text-[#2C3E50]">
                        {selectedRental.with_driver ? 'Driver Included' : 'No Driver'}
                      </span>
                    </div>
                  </div>

                  {/* Right Finance */}
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Deposit Amount</span>
                      <span className="font-bold text-[#2C3E50]">
                        {selectedRental.currency} {selectedRental.deposit_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Deposit Paid</span>
                      <span className="font-bold text-[#2C3E50]">{selectedRental.deposit_paid ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Total Charged</span>
                      <span className="font-bold text-[#2C3E50]">
                        {selectedRental.currency} {selectedRental.total_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Amount Paid</span>
                      <span className="font-bold text-[#2C3E50]">
                        {selectedRental.currency} {selectedRental.amount_paid?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contract Section */}
                {selectedRental.rental_contracts && selectedRental.rental_contracts.length > 0 && (
                  <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#BDC3C7]/10 space-y-4">
                    <h3 className="font-bold text-sm text-[#2C3E50] uppercase tracking-wider">Rental Contract</h3>
                    {selectedRental.rental_contracts.map((c: any) => (
                      <div key={c.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#2C3E50]">
                            Contract Status: {c.is_signed ? 'Digitally Signed' : 'Awaiting Signature'}
                          </p>
                          {c.signed_at && <p className="text-xs text-[#BDC3C7]">Signed At: {c.signed_at}</p>}
                        </div>
                        {c.pdf_url && (
                          <a href={c.pdf_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline">Download PDF Contract</Button>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#BDC3C7]/10 max-w-2xl mx-auto space-y-4">
          <Car className="h-12 w-12 text-[#BDC3C7] mx-auto" />
          <h2 className="text-lg font-bold text-[#2C3E50]">No Rentals Found</h2>
          <p className="text-[#BDC3C7]">You haven't booked any vehicles yet. Let's browse the fleet catalog to find your ride!</p>
          <div className="pt-2">
            <Link href="/rent">
              <Button variant="default" className="bg-[#E67E22] hover:bg-[#D35400]">Book a Rental</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}