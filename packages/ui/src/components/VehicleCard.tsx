import React from 'react';
import { IVehicle } from '@chatowa/types';
import { Settings, Droplet, User, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardContent } from './Card';
import { VehicleStatusBadge } from './StatusBadge';

export interface VehicleCardProps {
  vehicle: IVehicle;
  onClick?: (vehicle: IVehicle) => void;
  className?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick, className }) => {
  return (
    <Card 
      className={cn('overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer group', className)}
      padding="none"
      onClick={() => onClick?.(vehicle)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F6F7]">
        {vehicle.primaryImageUrl ? (
          <img 
            src={vehicle.primaryImageUrl} 
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-3 left-3">
          <VehicleStatusBadge status={vehicle.status} />
        </div>
        <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {vehicle.registrationNo}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[#2C3E50] truncate">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm font-medium text-[#E67E22] mt-1">
            {vehicle.rentalRateDaily ? `${vehicle.rentalCurrency} ${vehicle.rentalRateDaily} / day` : 'Price unlisted'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            <span className="capitalize">{vehicle.transmission.toLowerCase()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplet className="h-3.5 w-3.5" />
            <span className="capitalize">{vehicle.fuelType.toLowerCase()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{vehicle.seatCapacity || '-'} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};