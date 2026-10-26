/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Pin,
  RefreshCw,
  PieChart,
  Zap,
  Heart,
  TrendingUp,
  UtensilsCrossed,
  ShieldCheck,
} from 'lucide-react';

export default function ValuesSection() {
  const cards = [
    {
      title: 'Maintaining Transparency',
      description: 'Absolute clarity with zero hidden charges and honest 100 Bob pricing for every single meal plate.',
      bg: 'bg-[#00843D]',
      textColor: 'text-white',
      icon: ShieldCheck,
      iconColor: 'text-[#F5BA13]',
    },
    {
      title: 'Fast & Reliable Service',
      description: 'Lightning-fast preparation tailored specifically for workers and students on tight lunch breaks.',
      bg: 'bg-[#F5BA13]',
      textColor: 'text-[#0C1E17]',
      icon: Zap,
      iconColor: 'text-[#0C1E17]',
    },
    {
      title: 'Freshness Guaranteed',
      description: '100% fresh market ingredients bought daily from Wakulima Market — never-frozen, cooked with care.',
      bg: 'bg-[#F5BA13]',
      textColor: 'text-[#0C1E17]',
      icon: Pin,
      iconColor: 'text-[#0C1E17]',
    },
    {
      title: 'Quality & Value',
      description: 'Simple Kenyan soul food crafted right that honors your hard-earned 100 Bob note.',
      bg: 'bg-[#00843D]',
      textColor: 'text-white',
      icon: RefreshCw,
      iconColor: 'text-[#F5BA13]',
    },
    {
      title: 'Speed & Consistency',
      description: 'Piping hot chapatis and ugali plates delivered in under 3 minutes without sacrificing quality.',
      bg: 'bg-[#F5BA13]',
      textColor: 'text-[#0C1E17]',
      icon: PieChart,
      iconColor: 'text-[#0C1E17]',
    },
    {
      title: 'High Energy',
      description: 'We move fast, work as one, and bring contagious positive energy to every single rush hour.',
      bg: 'bg-[#00843D]',
      textColor: 'text-white',
      icon: Zap,
      iconColor: 'text-[#F5BA13]',
    },
    {
      title: 'People First',
      description: 'Dignified dining for every customer, fair wages for kibanda chefs, and community leadership that listens.',
      bg: 'bg-[#F5BA13]',
      textColor: 'text-[#0C1E17]',
      icon: Heart,
      iconColor: 'text-[#0C1E17]',
    },
    {
      title: 'Growth Plan',
      description: 'Empowering local cooks with hygiene certifications, business mentoring, and digital payment systems.',
      bg: 'bg-[#00843D]',
      textColor: 'text-white',
      icon: TrendingUp,
      iconColor: 'text-[#F5BA13]',
    },
  ];

  return (
    <section id="values" className="py-20 bg-[#F8F9F5] text-[#0C1E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#00843D]" />
            <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-emerald-800">
              OUR VALUE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0C1E17] leading-tight">
            Our Core Values And Progress Towards{' '}
            <span className="text-[#00843D]">Culinary Excellence.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
            At 100-Meal Kenya, we focus on quality, speed, and consistency. Our small menu design ensures every single item is fresh, never-frozen, and crafted right.
          </p>

          {/* Progress Indicators */}
          <div className="mt-10 space-y-6 max-w-xl mx-auto text-left">
            <div>
              <div className="flex justify-between items-center text-sm font-extrabold mb-2 text-[#0C1E17]">
                <span>Freshness & Quality</span>
                <span className="text-[#00843D]">98%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#00843D] rounded-full" style={{ width: '98%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm font-extrabold mb-2 text-[#0C1E17]">
                <span>Customer Satisfaction & Value</span>
                <span className="text-[#00843D]">96%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#00843D] rounded-full" style={{ width: '96%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Dual Card */}
        <div className="max-w-xl mx-auto mb-16 rounded-[36px] overflow-hidden shadow-2xl transition-transform hover:-translate-y-1">
          {/* Top Half Green */}
          <div className="bg-[#00843D] text-white p-8 sm:p-10">
            <h3 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">
              Maintaining Transparency
            </h3>
            <p className="text-sm sm:text-base font-medium text-emerald-50 leading-relaxed">
              Absolute clarity with zero hidden fees and honest 100 Bob pricing for every single meal plate.
            </p>
          </div>
          {/* Bottom Half Yellow */}
          <div className="bg-[#F5BA13] text-[#0C1E17] p-8 sm:p-10">
            <h3 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">
              Fast & Reliable Service
            </h3>
            <p className="text-sm sm:text-base font-medium text-[#0C1E17]/95 leading-relaxed">
              Lightning-fast preparation tailored specifically for your busy schedule, keeping lunch breaks efficient.
            </p>
          </div>
        </div>

        {/* Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.slice(2).map((c, idx) => {
            const IconComponent = c.icon;
            return (
              <div
                key={idx}
                className={`${c.bg} ${c.textColor} rounded-3xl p-8 flex flex-col justify-between shadow-xl transition-transform hover:-translate-y-1.5`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center mb-6">
                    <IconComponent className={`w-6 h-6 ${c.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-black leading-snug mb-3 tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed opacity-95">
                    {c.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
