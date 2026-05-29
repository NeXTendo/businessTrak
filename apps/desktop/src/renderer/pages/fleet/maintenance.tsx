import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle, Input, Select, Textarea } from '@chatowa/ui';
import { ArrowLeft, Plus, Wrench, CheckCircle2, Clock } from 'lucide-react';

const mockRecords = [
  { id: '1', type: 'Oil Change', date: '2025-11-10', mileage: 12000, cost: 1200, status: 'completed', notes: 'Full synthetic 5W-30' },
  { id: '2', type: 'Tyre Rotation', date: '2026-01-22', mileage: 14500, cost: 800, status: 'completed', notes: '' },
  { id: '3', type: 'Service (90k)', date: '2026-06-01', mileage: 90000, cost: 0, status: 'scheduled', notes: 'Upcoming major service' },
];

export default function FleetMaintenance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Maintenance Log"
        description="ABX 1234 — Toyota Hilux 2023"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/fleet/${id}`)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="gap-2" onClick={() => setShowForm(v => !v)}>
              <Plus className="h-4 w-4" /> Log Service
            </Button>
          </>
        }
      />

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Maintenance Record</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input label="Service Type" placeholder="e.g. Oil Change" />
            <Input label="Date" type="date" />
            <Input label="Mileage at Service (km)" type="number" />
            <Input label="Cost (ZMW)" type="number" />
            <Select label="Status" options={[{ label: 'Completed', value: 'completed' }, { label: 'Scheduled', value: 'scheduled' }]} value="completed" onValueChange={() => {}} />
            <div className="md:col-span-2 xl:col-span-3">
              <Textarea label="Notes" placeholder="Service notes..." rows={3} />
            </div>
            <div className="md:col-span-2 xl:col-span-3 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button><CheckCircle2 className="h-4 w-4 mr-2" />Save Record</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {mockRecords.map(r => (
          <div key={r.id} className="flex items-center gap-4 rounded-xl border border-[#BDC3C7]/60 bg-white p-5 shadow-sm">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${r.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              {r.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#2C3E50]">{r.type}</p>
              <p className="text-sm text-gray-500">{r.date} · {r.mileage.toLocaleString()} km{r.notes ? ` · ${r.notes}` : ''}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#2C3E50]">ZMW {r.cost.toLocaleString()}</p>
              <span className={`text-xs font-medium ${r.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
