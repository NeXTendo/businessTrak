'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/client';
import { Card, Badge, Button } from '@chatowa/ui';
import { ShoppingBag, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerPurchasesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadPurchases() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (customer) {
          const { data: salesData, error } = await supabase
            .from('sales')
            .select('*, vehicles(*), sale_payments(*)')
            .eq('customer_id', customer.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setSales(salesData || []);
          if (salesData && salesData.length > 0) {
            setSelectedSale(salesData[0]);
          }
        }
      } catch (err) {
        console.error('Error loading purchases:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPurchases();
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
        <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">My Purchases</h1>
        <p className="text-[#BDC3C7]">Track your vehicle purchases, installment schedules, and receipt histories.</p>
      </div>

      {sales.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List - Left Side */}
          <div className="lg:col-span-4 space-y-4">
            {sales.map((s) => {
              const isSelected = selectedSale?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSale(s)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#E67E22] bg-[#E67E22]/5 shadow-sm'
                      : 'border-[#BDC3C7]/15 bg-white hover:border-[#E67E22]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#BDC3C7]">{s.sale_number}</span>
                    <Badge variant={s.sale_status === 'completed' ? 'success' : 'warning'} className="capitalize">
                      {s.sale_status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#2C3E50]">{s.vehicles?.make} {s.vehicles?.model}</h3>
                  <div className="flex items-center space-x-2 text-xs text-[#BDC3C7] mt-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Ordered: {format(new Date(s.created_at), 'yyyy-MM-dd')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details - Right Side */}
          <div className="lg:col-span-8">
            {selectedSale && (
              <Card className="p-8 border border-[#BDC3C7]/10 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#BDC3C7]/10 pb-6">
                  <div>
                    <span className="text-xs font-bold text-[#BDC3C7] uppercase tracking-wider">Purchase details</span>
                    <h2 className="text-2xl font-extrabold text-[#2C3E50] mt-1">
                      {selectedSale.vehicles?.make} {selectedSale.vehicles?.model}
                    </h2>
                  </div>
                  <Badge variant={selectedSale.sale_status === 'completed' ? 'success' : 'warning'} className="text-sm capitalize py-1 px-3">
                    {selectedSale.sale_status}
                  </Badge>
                </div>

                {/* Purchase specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Sale Number</span>
                      <span className="font-bold text-[#2C3E50]">{selectedSale.sale_number}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Purchase Mode</span>
                      <span className="font-bold text-[#2C3E50] capitalize">
                        {selectedSale.sale_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Agreed Price</span>
                      <span className="font-bold text-[#2C3E50]">
                        {selectedSale.currency} {selectedSale.agreed_price?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Total Paid</span>
                      <span className="font-bold text-[#2C3E50]">
                        {selectedSale.currency} {selectedSale.total_paid?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                      <span className="text-[#BDC3C7]">Balance Due</span>
                      <span className="font-bold text-[#2C3E50]">
                        {selectedSale.currency} {selectedSale.balance_due?.toLocaleString()}
                      </span>
                    </div>
                    {selectedSale.next_payment_date && (
                      <div className="flex justify-between py-2 border-b border-[#BDC3C7]/5">
                        <span className="text-[#BDC3C7]">Next Payment Due</span>
                        <span className="font-bold text-[#E67E22]">{selectedSale.next_payment_date}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Installment Plan Breakdown */}
                {selectedSale.sale_type === 'installment' && (
                  <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#BDC3C7]/10 space-y-4">
                    <h3 className="font-bold text-sm text-[#2C3E50] uppercase tracking-wider flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-[#E67E22]" />
                      Installment Plan Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="block text-[#BDC3C7] text-xs">Total Installments</span>
                        <span className="block font-bold text-[#2C3E50] mt-1">{selectedSale.installment_count} Months</span>
                      </div>
                      <div>
                        <span className="block text-[#BDC3C7] text-xs">Monthly Payment</span>
                        <span className="block font-bold text-[#2C3E50] mt-1">
                          {selectedSale.currency} {selectedSale.installment_amount?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[#BDC3C7] text-xs">Down Payment Amount</span>
                        <span className="block font-bold text-[#2C3E50] mt-1">
                          {selectedSale.currency} {selectedSale.down_payment?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#BDC3C7]/10 max-w-2xl mx-auto space-y-4">
          <ShoppingBag className="h-12 w-12 text-[#BDC3C7] mx-auto" />
          <h2 className="text-lg font-bold text-[#2C3E50]">No Purchases Found</h2>
          <p className="text-[#BDC3C7]">You haven't bought any vehicles yet. Let's browse the sales catalog!</p>
          <div className="pt-2">
            <Link href="/buy">
              <Button variant="default" className="bg-[#E67E22] hover:bg-[#D35400]">Browse Sales</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}