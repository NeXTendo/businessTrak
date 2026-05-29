'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea } from '@chatowa/ui';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you for reaching out! We will contact you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#2C3E50] via-[#1A252F] to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-[#BDC3C7] max-w-xl mx-auto text-lg">
            Reach out for rentals, inquiries, vehicle valuations, or sales support.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#2C3E50]">Get in touch directly</h2>
              <p className="text-[#BDC3C7]">Have questions? Our support team is here to assist you 24/7.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl border border-[#BDC3C7]/10">
                <Phone className="h-6 w-6 text-[#E67E22] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#2C3E50]">Phone</h3>
                  <p className="text-sm text-[#BDC3C7] mt-1">+260 97 0000000</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl border border-[#BDC3C7]/10">
                <Mail className="h-6 w-6 text-[#E67E22] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#2C3E50]">Email</h3>
                  <p className="text-sm text-[#BDC3C7] mt-1">info@chatowa.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl border border-[#BDC3C7]/10">
                <MapPin className="h-6 w-6 text-[#E67E22] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#2C3E50]">Headquarters</h3>
                  <p className="text-sm text-[#BDC3C7] mt-1">Plot 123, Great East Road, Lusaka, Zambia</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl border border-[#BDC3C7]/10">
                <Clock className="h-6 w-6 text-[#E67E22] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#2C3E50]">Business Hours</h3>
                  <p className="text-sm text-[#BDC3C7] mt-1">Mon - Sat: 08:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#BDC3C7]/10 shadow-sm">
            <h3 className="text-xl font-bold text-[#2C3E50] mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#2C3E50] mb-2">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2C3E50] mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2C3E50] mb-2">Subject</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subject of inquiry"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2C3E50] mb-2">Message *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="default"
                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white py-3 font-semibold shadow-md"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Submit Inquiry'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}