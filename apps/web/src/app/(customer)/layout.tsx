'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { Button } from '@chatowa/ui';
import { 
  Car, 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  FolderOpen, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile({
        ...userProfile,
        email: user.email,
      });
      setLoading(false);
    }
    loadSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully.');
      router.push('/');
    } catch (err) {
      toast.error('Failed to log out.');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'My Rentals', href: '/rentals', icon: <FileText className="h-5 w-5" /> },
    { name: 'My Purchases', href: '/purchases', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'My Documents', href: '/documents', icon: <FolderOpen className="h-5 w-5" /> },
    { name: 'Notifications', href: '/notifications', icon: <Bell className="h-5 w-5" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="bg-[#E67E22] p-4 rounded-2xl text-white">
            <Car className="h-10 w-10 animate-bounce" />
          </div>
          <span className="text-[#BDC3C7] font-semibold">Loading portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2C3E50] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#2C3E50] text-white border-r border-[#BDC3C7]/10">
        {/* Brand */}
        <div className="h-20 flex items-center px-8 border-b border-[#BDC3C7]/10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#E67E22] p-2 rounded-lg text-white shadow-lg">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-wider">
              CHATOWA<span className="text-[#E67E22]">.</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/15'
                    : 'text-[#BDC3C7] hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Card & Logout */}
        <div className="p-4 border-t border-[#BDC3C7]/10 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-10 w-10 rounded-full bg-[#E67E22] flex items-center justify-center font-bold text-white uppercase">
              {profile?.full_name?.charAt(0) || <User className="h-5 w-5" />}
            </div>
            <div className="truncate">
              <h4 className="text-sm font-bold text-white truncate">{profile?.full_name}</h4>
              <p className="text-xs text-[#BDC3C7] truncate">{profile?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start border-white/20 text-[#BDC3C7] hover:bg-white/5 hover:text-white flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Menu & Main View Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-[#2C3E50] text-white flex items-center justify-between px-6 border-b border-[#BDC3C7]/10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#E67E22] p-2 rounded-lg text-white">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-wider">
              CHATOWA<span className="text-[#E67E22]">.</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-white"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Nav overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="relative flex flex-col w-72 bg-[#2C3E50] text-white p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold tracking-wider">Navigation</span>
                <button onClick={() => setSidebarOpen(false)}><X className="h-6 w-6" /></button>
              </div>
              <nav className="flex-grow space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                        isActive ? 'bg-[#E67E22] text-white' : 'text-[#BDC3C7]'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-4 border-t border-[#BDC3C7]/10">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-white/20 text-[#BDC3C7]"
                >
                  <LogOut className="h-4 w-4 mr-2 inline" /> Logout
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-grow p-6 sm:p-8 lg:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
