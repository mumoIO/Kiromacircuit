/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, Sparkles, HeartHandshake, Award } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white text-[#0C1E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section Header & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00843D]" />
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-emerald-800">
                ABOUT 100-MEAL KENYA
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0C1E17] leading-tight">
              About Our Passion For{' '}
              <span className="text-[#00843D]">Fresh And Affordable Food.</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              Our menu is small by design. We focus on chapatis, simmered yellow beans, ugali mlima, fresh greens, and smochas to deliver consistent quality, fast service, and undeniable value. Every single order is prepared fresh to order with care.
            </p>

            <div className="space-y-5 pt-3">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#00843D] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900">
                    100% Fresh & Never-Frozen
                  </h4>
                  <p className="text-sm text-gray-600 font-medium mt-0.5">
                    Our food is made with fresh ingredients delivered from local farmer cooperatives every morning and prepared right before your eyes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#00843D] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900">
                    Small By Design
                  </h4>
                  <p className="text-sm text-gray-600 font-medium mt-0.5">
                    We keep our menu focused on signature staples to deliver lightning-fast lunch service without compromising flavor, hygiene, or budget.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Tray */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#081C15] border border-emerald-500/20 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1000&q=80"
                alt="Kenyan fresh food preparation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-black uppercase tracking-wider text-[#F5BA13] mb-1">
                  Chakula Safi Chini Ya Soo Moja
                </div>
                <div className="text-xl font-black">
                  Serving Nairobi, Mombasa, Kisumu, Nakuru & Eldoret
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Block */}
        <div className="bg-[#081C15] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-emerald-500/20">
          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-xs font-black tracking-widest uppercase text-emerald-300">
                OUR VISION & MISSION
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              To Become Kenya&apos;s Go-To Brand For{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-[#F5BA13]">
                Fresh, Affordable Daily Food.
              </span>
            </h3>

            <div className="w-24 h-1.5 bg-[#00843D] rounded-full my-6" />

            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                OUR MISSION
              </div>
              <p className="text-xl sm:text-2xl font-black text-gray-100">
                Fresh food. Fast service. Fair prices. Every time.
              </p>
              <p className="text-sm sm:text-base text-emerald-100/80 font-medium leading-relaxed max-w-2xl">
                Whether you&apos;re a university student scraping by on pocket money, a matatu conductor on a quick 10-minute break, or a worker in Westlands craving real Kenyan soul food, you deserve a piping hot, nutritious meal without paying more than 100 Bob.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
