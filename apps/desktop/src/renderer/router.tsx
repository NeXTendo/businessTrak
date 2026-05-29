import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { Skeleton } from '@chatowa/ui';
import { useAuthStore } from './stores/auth-store';

// ──────────────────────────────────────────────
// Lazy page components
// ──────────────────────────────────────────────
const Dashboard       = lazy(() => import('./pages/dashboard'));
const FleetList       = lazy(() => import('./pages/fleet'));
const FleetNew        = lazy(() => import('./pages/fleet/new'));
const FleetDetail     = lazy(() => import('./pages/fleet/[id]'));
const FleetEdit       = lazy(() => import('./pages/fleet/edit'));
const FleetMaint      = lazy(() => import('./pages/fleet/maintenance'));
const RentalsList     = lazy(() => import('./pages/rentals'));
const RentalNew       = lazy(() => import('./pages/rentals/new'));
const RentalDetail    = lazy(() => import('./pages/rentals/[id]'));
const RentalInspect   = lazy(() => import('./pages/rentals/inspection'));
const SalesList       = lazy(() => import('./pages/sales'));
const SaleNew         = lazy(() => import('./pages/sales/new'));
const SaleDetail      = lazy(() => import('./pages/sales/[id]'));
const Invoices        = lazy(() => import('./pages/finance/invoices'));
const Receipts        = lazy(() => import('./pages/finance/receipts'));
const Expenses        = lazy(() => import('./pages/finance/expenses'));
const Reports         = lazy(() => import('./pages/finance/reports'));
const PayrollList     = lazy(() => import('./pages/payroll'));
const PayrollProcess  = lazy(() => import('./pages/payroll/process'));
const CustomersList   = lazy(() => import('./pages/customers'));
const CustomerProfile = lazy(() => import('./pages/customers/[id]'));
const EmployeesList   = lazy(() => import('./pages/employees'));
const EmployeeProfile = lazy(() => import('./pages/employees/[id]'));
const Notifications   = lazy(() => import('./pages/notifications'));
const AuditLogs       = lazy(() => import('./pages/audit-logs'));
const Settings        = lazy(() => import('./pages/settings'));

// ──────────────────────────────────────────────
// Page loader skeleton
// ──────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex flex-col gap-4 p-6">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-4 w-80" />
    <div className="grid grid-cols-4 gap-4 mt-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
    </div>
    <Skeleton className="h-64 rounded-xl mt-2" />
  </div>
);

// ──────────────────────────────────────────────
// Auth guard — blocks unauthenticated users
// ──────────────────────────────────────────────
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <PageLoader />;
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

export const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/login" element={<AuthLayout />} />
    <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />

      <Route path="fleet">
        <Route index element={<Suspense fallback={<PageLoader />}><FleetList /></Suspense>} />
        <Route path="new" element={<Suspense fallback={<PageLoader />}><FleetNew /></Suspense>} />
        <Route path=":id" element={<Suspense fallback={<PageLoader />}><FleetDetail /></Suspense>} />
        <Route path=":id/edit" element={<Suspense fallback={<PageLoader />}><FleetEdit /></Suspense>} />
        <Route path=":id/maintenance" element={<Suspense fallback={<PageLoader />}><FleetMaint /></Suspense>} />
      </Route>

      <Route path="rentals">
        <Route index element={<Suspense fallback={<PageLoader />}><RentalsList /></Suspense>} />
        <Route path="new" element={<Suspense fallback={<PageLoader />}><RentalNew /></Suspense>} />
        <Route path=":id" element={<Suspense fallback={<PageLoader />}><RentalDetail /></Suspense>} />
        <Route path=":id/inspection" element={<Suspense fallback={<PageLoader />}><RentalInspect /></Suspense>} />
      </Route>

      <Route path="sales">
        <Route index element={<Suspense fallback={<PageLoader />}><SalesList /></Suspense>} />
        <Route path="new" element={<Suspense fallback={<PageLoader />}><SaleNew /></Suspense>} />
        <Route path=":id" element={<Suspense fallback={<PageLoader />}><SaleDetail /></Suspense>} />
      </Route>

      <Route path="finance">
        <Route index element={<Navigate to="/finance/invoices" replace />} />
        <Route path="invoices" element={<Suspense fallback={<PageLoader />}><Invoices /></Suspense>} />
        <Route path="receipts" element={<Suspense fallback={<PageLoader />}><Receipts /></Suspense>} />
        <Route path="expenses" element={<Suspense fallback={<PageLoader />}><Expenses /></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<PageLoader />}><Reports /></Suspense>} />
      </Route>

      <Route path="payroll">
        <Route index element={<Suspense fallback={<PageLoader />}><PayrollList /></Suspense>} />
        <Route path="process" element={<Suspense fallback={<PageLoader />}><PayrollProcess /></Suspense>} />
      </Route>

      <Route path="customers">
        <Route index element={<Suspense fallback={<PageLoader />}><CustomersList /></Suspense>} />
        <Route path=":id" element={<Suspense fallback={<PageLoader />}><CustomerProfile /></Suspense>} />
      </Route>

      <Route path="employees">
        <Route index element={<Suspense fallback={<PageLoader />}><EmployeesList /></Suspense>} />
        <Route path=":id" element={<Suspense fallback={<PageLoader />}><EmployeeProfile /></Suspense>} />
      </Route>

      <Route path="notifications" element={<Suspense fallback={<PageLoader />}><Notifications /></Suspense>} />
      <Route path="audit-logs" element={<Suspense fallback={<PageLoader />}><AuditLogs /></Suspense>} />
      <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRouter;