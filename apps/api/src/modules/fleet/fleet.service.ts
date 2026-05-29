import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { IVehicle } from '@chatowa/types';

@Injectable()
export class FleetService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  async findAll(): Promise<IVehicle[]> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as any as IVehicle[];
  }

  async findOne(id: string): Promise<IVehicle> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException(`Vehicle with ID ${id} not found`);
    return data as any as IVehicle;
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<IVehicle> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .insert(createVehicleDto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any as IVehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<IVehicle> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .update(updateVehicleDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundException(`Vehicle with ID ${id} not found`);
    return data as any as IVehicle;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}