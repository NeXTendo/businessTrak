import React from 'react';
import { PageHeader, DataTable, Button, RentalStatusBadge } from '@chatowa/ui';
import { Plus } from 'lucide-react';

export default function RentalsList() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Rentals" 
        description="Manage all vehicle rentals and reservations"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Rental
          </Button>
        }
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable 
          data={[]} 
          columns={[
            { header: 'ID', accessorKey: 'id' },
            { header: 'Customer', accessorKey: 'customerId' },
            { header: 'Vehicle', accessorKey: 'vehicleId' },
            { header: 'Dates', accessorKey: 'dates' },
            { header: 'Status', accessorKey: 'status' }
          ]}
          emptyMessage="No rentals found."
        />
      </div>
    </div>
  );
}