import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, Card, CardContent, CardTitle, CardHeader } from '@chatowa/ui';
import {
  CarFront, CalendarClock, HandCoins, Wallet,
  TrendingUp, AlertCircle, Clock, Users, Wrench,
  ArrowUpRight, CheckCircle2
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth-store';

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function fetchFleetStats() {
  const { data } = await supabase
    .from('vehicles')
    .select('status');
  const counts: Record<string, number> = {
    available: 0, rented: 0, maintenance: 0, reserved: 0, sold: 0, in_transit: 0,
  };
  (data || []).forEach((v: any) => { counts[v.status] = (counts[v.status] || 0) + 1; });
  return counts;
}

async function fetchActiveRentals() {
  const { data, count } = await supabase
    .from('rentals')
    .select('id, customers(full_name), vehicles(make,model,registration_no), start_date, expected_return_date, status', { count: 'exact' })
    .in('status', ['active', 'approved'])
    .order('expected_return_date', { ascending: true })
    .limit(8);
  return { list: data || [], count: count || 0 };
}

async function fetchUpcomingReturns() {
  const now = new Date().toISOString();
  const soon = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
  const { data } = await supabase
    .from('rentals')
    .select('id, customers(full_name), vehicles(make,model), expected_return_date')
    .eq('status', 'active')
    .gte('expected_return_date', now)
    .lte('expected_return_date', soon)
    .order('expected_return_date', { ascending: true });
  return data || [];
}

async function fetchLateReturns() {
  const now = new Date().toISOString();
  const { data, count } = await supabase
    .from('rentals')
    .select('id, customers(full_name), vehicles(make,model), expected_return_date', { count: 'exact' })
    .eq('status', 'active')
    .lt('expected_return_date', now);
  return { list: data || [], count: count || 0 };
}

async function fetchRevenueThisMonth() {
  const start = new Date();
  start.setDate(1); start.setHours(0, 0, 0, 0);
  const { data } = await supabase
    .from('rental_payments')
    .select('amount, currency')
    .gte('created_at', start.toISOString())
    .eq('status', 'confirmed');
  const total = (data || []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  return total;
}

async function fetchMonthlySalesRevenue() {
  const start = new Date();
  start.setDate(1); start.setHours(0, 0, 0, 0);
  const { data } = await supabase
    .from('sale_payments')
    .select('amount')
    .gte('created_at', start.toISOString())
    .eq('status', 'confirmed');
  return (data || []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);
}

async function fetchNewCustomers() {
  const start = new Date();
  start.setDate(1); start.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', start.toISOString());
  return count || 0;
}

async function fetchMaintenanceAlerts() {
  const { data, count } = await supabase
    .from('vehicles')
    .select('id, make, model, registration_no', { count: 'exact' })
    .eq('status', 'maintenance');
  return { list: data || [], count: count || 0 };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ title, value, icon, sub, trend }: {
  title: string; value: string | number; icon: React.ReactNode;
  sub?: string; trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-[#2C3E50] mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
          </div>
          <div className="rounded-xl bg-[#2C3E50]/5 p-3">{icon}</div>
        </div>
        {trend === 'up' && (
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" /> This month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-6 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-8 w-16 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );
}

// ─── Role-gated Dashboard sections ───────────────────────────────────────────

function FleetUtilizationChart({ counts }: { counts: Record<string, number> }) {
  const data = [
    { name: 'Available', value: counts.available || 0, fill: '#27AE60' },
    { name: 'Rented',    value: counts.rented    || 0, fill: '#E67E22' },
    { name: 'Maint.',    value: counts.maintenance || 0, fill: '#E74C3C' },
    { name: 'Reserved',  value: counts.reserved   || 0, fill: '#3498DB' },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F4F6F7" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7F8C8D' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#7F8C8D' }} />
        <RechartsTooltip />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <rect key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { profile } = useAuthStore();
  const role = profile?.role || 'worker';

  const canSeeFinance  = ['super_admin', 'admin', 'finance'].includes(role);
  const canSeeAnalytics = ['super_admin', 'admin'].includes(role);
  const canSeeFleet    = ['super_admin', 'admin', 'finance', 'worker'].includes(role);

  const { data: fleetStats, isLoading: loadingFleet }     = useQuery({ queryKey: ['fleet-stats'],      queryFn: fetchFleetStats,            enabled: canSeeFleet });
  const { data: rentals,    isLoading: loadingRentals }   = useQuery({ queryKey: ['active-rentals'],   queryFn: fetchActiveRentals });
  const { data: upcoming,   isLoading: loadingUpcoming }  = useQuery({ queryKey: ['upcoming-returns'], queryFn: fetchUpcomingReturns });
  const { data: lateData,   isLoading: loadingLate }      = useQuery({ queryKey: ['late-returns'],     queryFn: fetchLateReturns });
  const { data: rentalRev } = useQuery({ queryKey: ['rental-revenue'],  queryFn: fetchRevenueThisMonth,    enabled: canSeeFinance });
  const { data: salesRev }  = useQuery({ queryKey: ['sales-revenue'],   queryFn: fetchMonthlySalesRevenue, enabled: canSeeFinance });
  const { data: newCust }   = useQuery({ queryKey: ['new-customers'],   queryFn: fetchNewCustomers,        enabled: canSeeAnalytics });
  const { data: maintData } = useQuery({ queryKey: ['maintenance'],     queryFn: fetchMaintenanceAlerts,   enabled: canSeeFleet });

  const totalVehicles = fleetStats
    ? Object.values(fleetStats).reduce((a, b) => a + b, 0)
    : 0;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'there'}. Here's what's happening today.`}
      />

      {/* ── KPI Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Active Rentals — all roles */}
        {loadingRentals ? <SkeletonCard /> : (
          <KpiCard
            title="Active Rentals"
            value={rentals?.count ?? 0}
            icon={<CalendarClock className="h-5 w-5 text-[#E67E22]" />}
            sub="Currently on road"
          />
        )}

        {/* Fleet size — fleet roles */}
        {canSeeFleet && (loadingFleet ? <SkeletonCard /> : (
          <KpiCard
            title="Fleet Size"
            value={totalVehicles}
            icon={<CarFront className="h-5 w-5 text-[#2C3E50]" />}
            sub={`${fleetStats?.available ?? 0} available`}
          />
        ))}

        {/* Revenue — finance roles */}
        {canSeeFinance && (
          <KpiCard
            title="Rental Revenue"
            value={formatCurrency(rentalRev ?? 0)}
            icon={<Wallet className="h-5 w-5 text-emerald-600" />}
            sub="This month"
            trend="up"
          />
        )}
        {canSeeFinance && (
          <KpiCard
            title="Sales Revenue"
            value={formatCurrency(salesRev ?? 0)}
            icon={<HandCoins className="h-5 w-5 text-blue-500" />}
            sub="This month"
            trend="up"
          />
        )}

        {/* New customers — admin/super_admin */}
        {canSeeAnalytics && (
          <KpiCard
            title="New Customers"
            value={newCust ?? 0}
            icon={<Users className="h-5 w-5 text-purple-500" />}
            sub="This month"
          />
        )}

        {/* Maintenance — fleet roles */}
        {canSeeFleet && (
          <KpiCard
            title="In Maintenance"
            value={maintData?.count ?? 0}
            icon={<Wrench className="h-5 w-5 text-red-500" />}
            sub="Vehicles"
          />
        )}
      </div>

      {/* ── Main content grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Active Rentals table — all roles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-[#2C3E50]">Active Rentals</CardTitle>
              <CalendarClock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="p-0">
              {loadingRentals ? (
                <div className="p-6 space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
                </div>
              ) : rentals?.list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <CheckCircle2 className="h-8 w-8 mb-2 text-emerald-400" />
                  <p className="text-sm">No active rentals at the moment</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Customer</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Vehicle</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Return Date</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rentals?.list.map((r: any) => {
                        const isLate = new Date(r.expected_return_date) < new Date();
                        return (
                          <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-[#2C3E50]">{r.customers?.full_name || '—'}</td>
                            <td className="px-4 py-3 text-gray-600">{r.vehicles ? `${r.vehicles.make} ${r.vehicles.model}` : '—'}</td>
                            <td className={`px-4 py-3 ${isLate ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                              {r.expected_return_date ? new Date(r.expected_return_date).toLocaleDateString('en-GB') : '—'}
                              {isLate && <span className="ml-1 text-xs">(OVERDUE)</span>}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                r.status === 'active' ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Late Returns Alert */}
          {!loadingLate && (lateData?.count ?? 0) > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-700">
                    {lateData?.count} Overdue Return{(lateData?.count ?? 0) > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-1">
                  {lateData?.list.slice(0, 3).map((r: any) => (
                    <p key={r.id} className="text-xs text-red-600">
                      {r.customers?.full_name} — {r.vehicles?.make} {r.vehicles?.model}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Returns (48h) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#2C3E50] flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#E67E22]" /> Returns in 48h
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loadingUpcoming ? (
                <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}</div>
              ) : (upcoming?.length ?? 0) === 0 ? (
                <p className="text-xs text-gray-400">No upcoming returns in the next 48 hours.</p>
              ) : (
                <div className="space-y-2">
                  {upcoming?.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-[#2C3E50] text-xs">{r.customers?.full_name}</p>
                        <p className="text-gray-500 text-xs">{r.vehicles?.make} {r.vehicles?.model}</p>
                      </div>
                      <span className="text-xs text-[#E67E22] font-medium">
                        {new Date(r.expected_return_date).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fleet Utilization chart — admin/super_admin */}
          {canSeeAnalytics && fleetStats && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-[#2C3E50]">Fleet Utilization</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <FleetUtilizationChart counts={fleetStats} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Maintenance Alerts — fleet roles ────────────────── */}
      {canSeeFleet && (maintData?.count ?? 0) > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#2C3E50] flex items-center gap-2">
              <Wrench className="h-4 w-4 text-red-500" /> Vehicles Under Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {maintData?.list.map((v: any) => (
                <div key={v.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                  <p className="text-xs font-semibold text-red-700">{v.make} {v.model}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.registration_no}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}