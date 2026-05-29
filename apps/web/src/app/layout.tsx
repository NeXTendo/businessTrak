import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = { title: 'Chatowa Investments', description: 'Premium Vehicle Rentals and Sales in Zambia' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}<Toaster richColors position='top-right' /></body>
    </html>
  );
}