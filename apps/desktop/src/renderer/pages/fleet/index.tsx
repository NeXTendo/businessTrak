import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, VehicleStatusBadge } from '@chatowa/ui';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth-store';

const STATUS_COLORS: Record<string, string> = {
  available:   'bg-emerald-100 text-emerald-700',
  rented:      'bg-orange-100 text-orange-700',
  reserved:    'bg-blue-100 text-blue-700',
  maintenance: 'bg-red-100 text-red-700',
  sold:        'bg-gray-100 text-gray-600',
  in_transit:  'bg-purple-100 text-purple-700',
};

async function fetchVehicles(statusFilter: string) {
  let query = supabase
    .from('vehicles')
    .select('id, registration_no, make, model, year, color, fuel_type, transmission, mileage, rental_rate_daily, rental_currency, status, is_published, has_driver_option, insurance_expiry, road_tax_expiry')
    .order('created_at', { ascending: false });
  if (statusFilter !== 'all') query = query.eq('status', statusFilter);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export default function FleetList() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const role = profile?.role || 'worker';
  const canManage = ['super_admin', 'admin'].includes(role);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: vehicles = [], isLoading, refetch } = useQuery({
    queryKey: ['vehicles', statusFilter],
    queryFn: () => fetchVehicles(statusFilter),
  });

  const filtered = vehicles.filter((v: any) => {
    const q = search.toLowerCase();
    return !q || v.registration_no?.toLowerCase().includes(q) ||
      v.make?.toLowerCase().includes(q) || v.model?.toLowerCase().includes(q);
  });

  const now = new Date();
  const isExpiringSoon = (dateStr: string | null) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    return days <= 30 && days >= 0;
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fleet Management"
        description={`${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} in your fleet`}
        actions={
          <>
            <button onClick={() => refetch()} className="flex items-center gap-1.5 rounded-lg border border-[#BDC3C7]/60 bg-white px-3 py-2 text-sm font-medium text-[#2C3E50] hover:bg-gray-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            {canManage && (
              <button onClick={() => navigate('/fleet/new')} className="flex items-center gap-1.5 rounded-lg bg-[#E67E22] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#D35400] transition-colors">
                <Plus className="h-4 w-4" /> Add Vehicle
              </button>
            )}
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by plate, make, model…"
          className="h-9 rounded-lg border border-[#BDC3C7]/60 bg-white px-3 text-sm text-[#2C3E50] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/40 w-64"
        />
        {['all', 'available', 'rented', 'reserved', 'maintenance', 'sold'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize border transition-colors ${
              statusFilter === s
                ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                : 'bg-white text-gray-600 border-[#BDC3C7]/60 hover:bg-gray-50'
            }`}
          >
            {s === 'all' ? 'All Vehicles' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-10 w-28 bg-gray-100 rounded" />
                <div className="h-10 flex-1 bg-gray-100 rounded" />
                <div className="h-10 w-24 bg-gray-100 rounded" />
                <div className="h-10 w-24 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="text-4xl mb-3">🚗</div>
            <p className="font-semibold text-gray-600">No vehicles found</p>
            <p className="text-sm mt-1">Try a different filter or add a new vehicle</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#2C3E50]/5 border-b border-[#BDC3C7]/30">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Vehicle</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Daily Rate</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mileage</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Insurance</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Published</th>
                {canManage && <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((v: any) => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/fleet/${v.id}`)}
                  className="hover:bg-[#F4F6F7] cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#2C3E50]">{v.registration_no}</div>
                    <div className="text-xs text-gray-500">{v.make} {v.model} · {v.year}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[v.status] || 'bg-gray-100 text-gray-600'}`}>
                      {v.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#2C3E50]">
                    {v.rental_rate_daily ? `${v.rental_currency || 'ZMW'} ${v.rental_rate_daily.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{v.mileage?.toLocaleString() ?? '—'} km</td>
                  <td className="px-5 py-3.5">
                    {v.insurance_expiry ? (
                      <span className={`text-xs font-medium ${isExpiringSoon(v.insurance_expiry) ? 'text-red-600' : 'text-gray-600'}`}>
                        {isExpiringSoon(v.insurance_expiry) && '⚠ '}
                        {new Date(v.insurance_expiry).toLocaleDateString('en-GB')}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex h-2 w-2 rounded-full ${v.is_published ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  </td>
                  {canManage && (
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => navigate(`/fleet/${v.id}/edit`)} className="text-xs text-[#E67E22] font-medium hover:underline mr-3">Edit</button>
                      <button onClick={() => navigate(`/fleet/${v.id}/maintenance`)} className="text-xs text-gray-500 hover:underline">Maintenance</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}