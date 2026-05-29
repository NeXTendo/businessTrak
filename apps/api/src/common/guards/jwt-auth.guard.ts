import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error || !data.user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // We attach the user to the request object
      // Also fetch the user's role from our custom users/roles tables
      const { data: roleData } = await this.supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', data.user.id)
        .single();

      request['user'] = {
        id: data.user.id,
        email: data.user.email,
        role: (Array.isArray(roleData?.roles) ? roleData.roles[0]?.name : (roleData?.roles as any)?.name) || 'customer',
      };
      
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}