import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ISale } from '@chatowa/types';

@Injectable()
export class SalesService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  async findAll(): Promise<ISale[]> {
    const { data, error } = await this.supabase
      .from('sales')
      .select('*, vehicle:vehicles(*), customer:customers(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as any as ISale[];
  }

  async findOne(id: string): Promise<ISale> {
    const { data, error } = await this.supabase
      .from('sales')
      .select('*, vehicle:vehicles(*), customer:customers(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException(`Sale with ID ${id} not found`);
    return data as any as ISale;
  }

  async create(createSaleDto: CreateSaleDto): Promise<ISale> {
    const { data, error } = await this.supabase
      .from('sales')
      .insert(createSaleDto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any as ISale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<ISale> {
    const { data, error } = await this.supabase
      .from('sales')
      .update(updateSaleDto as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundException(`Sale with ID ${id} not found`);
    return data as any as ISale;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}