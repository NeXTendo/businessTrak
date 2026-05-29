import React from 'react';
import Link from 'next/link';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A252F] text-[#BDC3C7] border-t border-[#BDC3C7]/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-[#E67E22] p-2 rounded-lg text-white shadow-lg">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                CHATOWA<span className="text-[#E67E22]">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Zambia's premier platform for vehicle sales and rentals. Experience luxury, reliability, and unparalleled service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/rent" className="hover:text-white transition-colors">Rent a Car</Link></li>
              <li><Link href="/buy" className="hover:text-white transition-colors">Buy a Car</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Customer Portal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">My Dashboard</Link></li>
              <li><Link href="/rentals" className="hover:text-white transition-colors">My Rentals</Link></li>
              <li><Link href="/purchases" className="hover:text-white transition-colors">My Purchases</Link></li>
              <li><Link href="/documents" className="hover:text-white transition-colors">My Documents</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-[#E67E22]" />
                <span>Plot 123, Great East Road, Lusaka, Zambia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#E67E22]" />
                <span>+260 97 0000000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#E67E22]" />
                <span>info@chatowa.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#BDC3C7]/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>&copy; {new Date().getFullYear()} Chatowa Investments. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
