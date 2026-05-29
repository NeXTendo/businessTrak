'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { Card, Badge, Button } from '@chatowa/ui';
import { Bell, Check, Trash2, MailOpen } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadNotifications() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err) {
        console.error('Error loading notifications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      toast.success('Notification marked as read.');
    } catch (err) {
      toast.error('Failed to update notification.');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to update notifications.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-white rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">Notifications</h1>
          <p className="text-[#BDC3C7]">Stay updated with alerts on your rentals, invoices, and payments.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <Button variant="outline" onClick={markAllAsRead} className="flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Mark All Read</span>
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <Card className="border border-[#BDC3C7]/10 overflow-hidden bg-white">
          <div className="divide-y divide-[#BDC3C7]/10">
            {notifications.map((n) => (
              <div key={n.id} className={`p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 transition-colors ${
                n.is_read ? 'opacity-70 bg-white' : 'bg-orange-500/5'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    n.is_read ? 'bg-[#BDC3C7]/10 text-[#BDC3C7]' : 'bg-[#E67E22]/10 text-[#E67E22]'
                  }`}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-bold text-[#2C3E50] ${n.is_read ? '' : 'text-orange-950'}`}>
                      {n.title}
                    </h3>
                    <p className="text-sm text-[#BDC3C7] leading-relaxed">{n.message}</p>
                    <span className="block text-xs text-[#BDC3C7] font-medium pt-1">
                      {format(new Date(n.created_at), 'yyyy-MM-dd HH:mm')}
                    </span>
                  </div>
                </div>

                {!n.is_read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(n.id)}
                    className="flex items-center space-x-1.5 self-end sm:self-auto"
                  >
                    <MailOpen className="h-4 w-4" />
                    <span>Mark Read</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#BDC3C7]/10 max-w-2xl mx-auto space-y-4">
          <Bell className="h-12 w-12 text-[#BDC3C7] mx-auto" />
          <h2 className="text-lg font-bold text-[#2C3E50]">All Caught Up!</h2>
          <p className="text-[#BDC3C7]">No notifications or alerts to show at the moment.</p>
        </div>
      )}
    </div>
  );
}