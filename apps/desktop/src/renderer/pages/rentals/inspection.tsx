import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Button, Textarea, Select } from '@chatowa/ui';
import { ArrowLeft, CheckCircle2, Camera, AlertTriangle } from 'lucide-react';

const sections = ['Front', 'Rear', 'Left Side', 'Right Side', 'Interior', 'Roof', 'Tyres', 'Fuel Level'];

export default function RentalInspection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState<'pre' | 'post'>('pre');
  const [conditions, setConditions] = useState<Record<string, string>>(
    Object.fromEntries(sections.map(s => [s, 'good']))
  );
  const [notes, setNotes] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicle Inspection"
        description={`Rental RNT-2025-0042 · ABX 1234 — Toyota Hilux`}
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/rentals/${id}`)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="gap-2"><CheckCircle2 className="h-4 w-4" /> Submit Inspection</Button>
          </>
        }
      />

      {/* Inspection Type */}
      <div className="flex gap-3">
        {(['pre', 'post'] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 rounded-xl border-2 py-3 font-semibold transition-all ${type === t ? 'border-[#E67E22] bg-[#E67E22]/10 text-[#E67E22]' : 'border-[#BDC3C7]/60 bg-white text-gray-500'}`}
          >
            {t === 'pre' ? '🔍 Pre-Rental Inspection' : '✅ Post-Rental Inspection'}
          </button>
        ))}
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map(section => (
          <div key={section} className="rounded-xl border border-[#BDC3C7]/60 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-[#2C3E50]">{section}</span>
              {conditions[section] === 'damaged' && <AlertTriangle className="h-4 w-4 text-red-500" />}
              {conditions[section] === 'good' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            </div>
            <select
              value={conditions[section]}
              onChange={e => setConditions(p => ({ ...p, [section]: e.target.value }))}
              className={`w-full rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50 ${
                conditions[section] === 'good' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                conditions[section] === 'minor' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <option value="good">Good</option>
              <option value="minor">Minor Issue</option>
              <option value="damaged">Damaged</option>
            </select>
            <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[#BDC3C7] py-1.5 text-xs text-gray-400 hover:border-[#E67E22] hover:text-[#E67E22] transition-colors">
              <Camera className="h-3 w-3" /> Add Photo
            </button>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-[#BDC3C7]/60 shadow-sm p-6">
        <Textarea
          label="Inspector Notes"
          placeholder="Any additional observations or damage descriptions..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
