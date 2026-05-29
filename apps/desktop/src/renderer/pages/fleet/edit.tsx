import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Button } from '@chatowa/ui';
import { ArrowLeft, Save } from 'lucide-react';
import FleetNew from './new';

// Edit reuses the same form as New, pre-populated
export default function FleetEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6">
      <div className="-mb-6">
        <div className="flex items-center justify-between px-0 pb-0">
          <div />
          <Button variant="outline" className="gap-2 mb-2" onClick={() => navigate(`/fleet/${id}`)}>
            <ArrowLeft className="h-4 w-4" /> Cancel
          </Button>
        </div>
      </div>
      <FleetNew />
    </div>
  );
}
