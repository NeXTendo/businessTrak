import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SidebarNav } from '@chatowa/ui';
import { 
  LayoutDashboard, CarFront, CalendarClock, HandCoins, 
  Wallet, Users, FileText, Bell, ShieldCheck, Settings, 
  LogOut, Cloud, CloudOff, Loader2 
} from 'lucide-react';
import { useAuthStore } from '../stores/auth-store';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuthStore();
  
  const syncState = { status: 'online', pending: 0 }; 
  const unreadNotifications = 0;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const role = profile?.role || 'worker';
  
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard />, active: location.pathname.startsWith('/dashboard'), roles: ['super_admin', 'admin', 'finance', 'worker'] },
    { id: 'fleet', label: 'Fleet', href: '/fleet', icon: <CarFront />, active: location.pathname.startsWith('/fleet'), roles: ['super_admin', 'admin', 'finance', 'worker'] },
    { id: 'rentals', label: 'Rentals', href: '/rentals', icon: <CalendarClock />, active: location.pathname.startsWith('/rentals'), roles: ['super_admin', 'admin', 'finance', 'worker'] },
    { id: 'sales', label: 'Sales', href: '/sales', icon: <HandCoins />, active: location.pathname.startsWith('/sales'), roles: ['super_admin', 'admin', 'finance'] },
    { id: 'finance', label: 'Finance', href: '/finance', icon: <Wallet />, active: location.pathname.startsWith('/finance'), roles: ['super_admin', 'admin', 'finance'] },
    { id: 'payroll', label: 'Payroll', href: '/payroll', icon: <FileText />, active: location.pathname.startsWith('/payroll'), roles: ['super_admin', 'finance'] },
    { id: 'customers', label: 'Customers', href: '/customers', icon: <Users />, active: location.pathname.startsWith('/customers'), roles: ['super_admin', 'admin', 'finance', 'worker'] },
    { id: 'employees', label: 'Employees', href: '/employees', icon: <Users />, active: location.pathname.startsWith('/employees'), roles: ['super_admin', 'admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  const allSystemItems = [
    { id: 'notifications', label: 'Notifications', href: '/notifications', icon: <Bell />, active: location.pathname.startsWith('/notifications'), badge: unreadNotifications > 0 ? unreadNotifications : undefined, roles: ['super_admin', 'admin', 'finance', 'worker'] },
    { id: 'audit-logs', label: 'Audit Logs', href: '/audit-logs', icon: <ShieldCheck />, active: location.pathname.startsWith('/audit-logs'), roles: ['super_admin'] },
    { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings />, active: location.pathname.startsWith('/settings'), roles: ['super_admin'] },
  ];

  const systemItems = allSystemItems.filter(item => item.roles.includes(role));

  // Extract initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F6F7]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-[#2C3E50] text-white transition-all">
        <div className="flex h-16 shrink-0 items-center px-6">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Chatowa <span className="text-[#E67E22]">IBMS</span>
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6">
          <SidebarNav items={navItems} title="Main Menu" />
          {systemItems.length > 0 && <SidebarNav items={systemItems} title="System" />}
        </div>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-[#BDC3C7] transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#BDC3C7]/40 bg-white px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#2C3E50] capitalize">
              {location.pathname.split('/')[1] || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Sync Status */}
            <div className="flex items-center gap-2 rounded-full border border-[#BDC3C7]/60 bg-[#F4F6F7] px-3 py-1.5 text-xs font-medium">
              {syncState.status === 'online' ? (
                <><Cloud className="h-3.5 w-3.5 text-emerald-500" /><span className="text-[#2C3E50]">Online</span></>
              ) : syncState.status === 'syncing' ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin text-[#E67E22]" /><span className="text-[#2C3E50]">Syncing... ({syncState.pending})</span></>
              ) : (
                <><CloudOff className="h-3.5 w-3.5 text-red-500" /><span className="text-[#2C3E50]">Offline ({syncState.pending})</span></>
              )}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#BDC3C7]/40">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E67E22] text-sm font-bold text-white shadow-sm">
                {profile ? getInitials(profile.full_name) : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none text-[#2C3E50]">{profile?.full_name || 'Unknown User'}</span>
                <span className="text-xs text-gray-500 mt-1 capitalize">{profile?.role?.replace('_', ' ') || 'Guest'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;