import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { IRental } from '@chatowa/types';

@Injectable()
export class RentalsService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  async findAll(): Promise<IRental[]> {
    const { data, error } = await this.supabase
      .from('rentals')
      .select('*, vehicle:vehicles(*), customer:customers(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as any as IRental[];
  }

  async findOne(id: string): Promise<IRental> {
    const { data, error } = await this.supabase
      .from('rentals')
      .select('*, vehicle:vehicles(*), customer:customers(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException(`Rental with ID ${id} not found`);
    return data as any as IRental;
  }

  async create(createRentalDto: CreateRentalDto): Promise<IRental> {
    const { data, error } = await this.supabase
      .from('rentals')
      .insert(createRentalDto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any as IRental;
  }

  async update(id: string, updateRentalDto: UpdateRentalDto): Promise<IRental> {
    const { data, error } = await this.supabase
      .from('rentals')
      .update(updateRentalDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundException(`Rental with ID ${id} not found`);
    return data as any as IRental;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('rentals')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}