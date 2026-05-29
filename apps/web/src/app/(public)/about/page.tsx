import React from 'react';
import { Target, Users, Landmark, Award } from 'lucide-react';

export default function AboutPage() {
  const cards = [
    {
      icon: <Target className="h-8 w-8 text-[#E67E22]" />,
      title: 'Our Mission',
      description: 'To provide the most reliable, secure, and modern fleet procurement and management services in Zambia.'
    },
    {
      icon: <Users className="h-8 w-8 text-[#E67E22]" />,
      title: 'Expert Team',
      description: 'A dedicated team of automotive specialists, professional drivers, and financial advisors at your service.'
    },
    {
      icon: <Landmark className="h-8 w-8 text-[#E67E22]" />,
      title: 'Zambian Heritage',
      description: 'Proudly serving local businesses, corporate partners, and citizens with locally tailored finance and rental solutions.'
    },
    {
      icon: <Award className="h-8 w-8 text-[#E67E22]" />,
      title: 'Quality Standard',
      description: 'Every vehicle undergoes rigorous multi-point inspections and maintenance checks before client deployment.'
    }
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#2C3E50] via-[#1A252F] to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">About Chatowa</h1>
          <p className="text-[#BDC3C7] max-w-xl mx-auto text-lg">
            Delivering transportation excellence and flexible asset ownership across Zambia.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 className="text-2xl font-bold text-[#2C3E50]">Who We Are</h2>
        <p className="text-[#BDC3C7] leading-relaxed text-lg">
          Established to bridge the gap in quality logistics and luxury automotive acquisitions, Chatowa Investments is a leading integrated fleet management company. From corporate long-term rentals with professional drivers to flexible vehicle installment sales, we cater to a diverse client base ranging from individual business owners to multi-national corporations.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-[#BDC3C7]/10 hover:shadow-lg transition-all duration-200 text-center">
              <div className="inline-flex p-3 bg-[#F8F9FA] rounded-xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-2">{card.title}</h3>
              <p className="text-sm text-[#BDC3C7] leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}