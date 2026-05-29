'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/client';
import { Card, Button, Badge } from '@chatowa/ui';
import { Car, FileText, ShoppingBag, FolderOpen, Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ activeRentals: 0, purchasesCount: 0, unreadNotifications: 0, documentCount: 0 });
  const [rentals, setRentals] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch User Profile
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(userProfile);

        // Fetch customer record
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (customer) {
          // Fetch rentals
          const { data: rentalsData } = await supabase
            .from('rentals')
            .select('*, vehicles(*)')
            .eq('customer_id', customer.id)
            .order('created_at', { ascending: false });

          setRentals(rentalsData || []);

          // Fetch sales
          const { data: salesData } = await supabase
            .from('sales')
            .select('*, vehicles(*)')
            .eq('customer_id', customer.id)
            .order('created_at', { ascending: false });

          setSales(salesData || []);

          // Fetch notifications
          const { data: notificationsData } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_read', false);

          // Fetch documents count (invoices + receipts)
          const { data: invoices } = await supabase
            .from('invoices')
            .select('id')
            .eq('customer_id', customer.id);

          const { data: receipts } = await supabase
            .from('receipts')
            .select('id')
            .eq('customer_id', customer.id);

          setStats({
            activeRentals: (rentalsData || []).filter((r: any) => r.status === 'active' || r.status === 'approved').length,
            purchasesCount: (salesData || []).length,
            unreadNotifications: (notificationsData || []).length,
            documentCount: (invoices || []).length + (receipts || []).length
          });
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-white rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greetings */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">Hello, {profile?.full_name || 'Valued Customer'}</h1>
          <p className="text-[#BDC3C7]">Here is an overview of your active contracts and requests.</p>
        </div>
        <Link href="/rent">
          <Button variant="default" className="bg-[#E67E22] hover:bg-[#D35400] flex items-center space-x-2">
            <span>Book New Vehicle</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border border-[#BDC3C7]/10 flex items-center space-x-4">
          <div className="p-3 bg-[#E67E22]/10 text-[#E67E22] rounded-xl"><Car className="h-6 w-6" /></div>
          <div>
            <span className="block text-sm text-[#BDC3C7] font-semibold">Active Rentals</span>
            <span className="block text-2xl font-bold text-[#2C3E50]">{stats.activeRentals}</span>
          </div>
        </Card>

        <Card className="p-6 border border-[#BDC3C7]/10 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><ShoppingBag className="h-6 w-6" /></div>
          <div>
            <span className="block text-sm text-[#BDC3C7] font-semibold">Purchases</span>
            <span className="block text-2xl font-bold text-[#2C3E50]">{stats.purchasesCount}</span>
          </div>
        </Card>

        <Card className="p-6 border border-[#BDC3C7]/10 flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><FolderOpen className="h-6 w-6" /></div>
          <div>
            <span className="block text-sm text-[#BDC3C7] font-semibold">My Documents</span>
            <span className="block text-2xl font-bold text-[#2C3E50]">{stats.documentCount}</span>
          </div>
        </Card>

        <Card className="p-6 border border-[#BDC3C7]/10 flex items-center space-x-4">
          <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl"><Bell className="h-6 w-6" /></div>
          <div>
            <span className="block text-sm text-[#BDC3C7] font-semibold">Unread Alerts</span>
            <span className="block text-2xl font-bold text-[#2C3E50]">{stats.unreadNotifications}</span>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Rentals */}
        <Card className="p-6 border border-[#BDC3C7]/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#2C3E50]">Recent Rentals</h3>
            <Link href="/rentals" className="text-xs font-bold text-[#E67E22] hover:text-[#D35400] transition-colors flex items-center">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {rentals.length > 0 ? (
              rentals.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-[#BDC3C7]/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#2C3E50]/5 text-[#2C3E50] rounded-lg"><Car className="h-5 w-5" /></div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2C3E50]">{r.vehicles?.make} {r.vehicles?.model}</h4>
                      <p className="text-xs text-[#BDC3C7]">Period: {r.start_date} to {r.end_date}</p>
                    </div>
                  </div>
                  <Badge variant={r.status === 'active' ? 'success' : 'neutral'} className="capitalize">{r.status}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-[#BDC3C7]">No rentals booked yet.</div>
            )}
          </div>
        </Card>

        {/* Recent Purchases */}
        <Card className="p-6 border border-[#BDC3C7]/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#2C3E50]">Recent Purchases</h3>
            <Link href="/purchases" className="text-xs font-bold text-[#E67E22] hover:text-[#D35400] transition-colors flex items-center">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {sales.length > 0 ? (
              sales.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-[#BDC3C7]/5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/5 text-blue-500 rounded-lg"><ShoppingBag className="h-5 w-5" /></div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2C3E50]">{s.vehicles?.make} {s.vehicles?.model}</h4>
                      <p className="text-xs text-[#BDC3C7]">Date: {format(new Date(s.created_at), 'yyyy-MM-dd')}</p>
                    </div>
                  </div>
                  <Badge variant={s.sale_status === 'completed' ? 'success' : 'warning'} className="capitalize">{s.sale_status}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-[#BDC3C7]">No purchases recorded yet.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}