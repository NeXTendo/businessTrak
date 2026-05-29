import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-[#2C3E50]">
      <Navbar />
      <div className="flex-grow pt-20">
        {children}
      </div>
      <Footer />
    </div>
  );
}
