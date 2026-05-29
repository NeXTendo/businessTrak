import React from 'react';
import { PageHeader, DataTable, Button, SaleStatusBadge } from '@chatowa/ui';
import { Plus } from 'lucide-react';

export default function SalesList() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Vehicle Sales" 
        description="Manage vehicle sales, installments, and trade-ins"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Sale
          </Button>
        }
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-[#BDC3C7]/60 p-5">
        <DataTable 
          data={[]} 
          columns={[
            { header: 'ID', accessorKey: 'id' },
            { header: 'Vehicle', accessorKey: 'vehicleId' },
            { header: 'Buyer', accessorKey: 'customerId' },
            { header: 'Type', accessorKey: 'type' },
            { header: 'Status', accessorKey: 'status' }
          ]}
          emptyMessage="No sales found."
        />
      </div>
    </div>
  );
}