import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ICustomer } from '@chatowa/types';

@Injectable()
export class CustomersService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  async findAll(): Promise<ICustomer[]> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as any as ICustomer[];
  }

  async findOne(id: string): Promise<ICustomer> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException(`Customer with ID ${id} not found`);
    return data as any as ICustomer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<ICustomer> {
    const { data, error } = await this.supabase
      .from('customers')
      .insert(createCustomerDto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any as ICustomer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<ICustomer> {
    const { data, error } = await this.supabase
      .from('customers')
      .update(updateCustomerDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundException(`Customer with ID ${id} not found`);
    return data as any as ICustomer;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}