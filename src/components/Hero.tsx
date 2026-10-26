/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, MapPin, CheckCircle2, Sparkles, Utensils, Heart } from 'lucide-react';

interface HeroProps {
  onViewMenu: () => void;
  onViewLocations: () => void;
  onOpenPlateBuilder: () => void;
}

export default function Hero({ onViewMenu, onViewLocations, onOpenPlateBuilder }: HeroProps) {
  return (
    <section id="hero" className="relative bg-[#081C15] text-white overflow-hidden pt-8 pb-16 lg:py-24">
      {/* Background Graphic Patterns & Warm Emerald Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00843D]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F5BA13]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 backdrop-blur-md shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-emerald-200">
                100-MEAL • ALWAYS FRESH • KENYA BUDGET DINING
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Fresh, Never-Frozen Food{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5BA13] via-amber-200 to-[#F5BA13]">
                Always Worth It.
              </span>
              <br />
              <span className="text-[#F8F9F5] block mt-2 text-3xl sm:text-4xl lg:text-5xl">
                Chapo. Ugali. Smocha. Done Right.
              </span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              At 100-Meal Kenya, we track down and celebrate the greatest spots, vibandas, and eateries across Nairobi,
              Mombasa, Kisumu, Nakuru, and beyond serving hearty, wholesome, dignity-packed meals strictly for <span className="font-extrabold text-[#F5BA13]">100 KSh or less</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onViewMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#00843D] hover:bg-[#006e33] text-white font-extrabold text-base px-8 py-4 rounded-full shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-98 border border-emerald-400/30"
              >
                <span>View Menu</span>
                <ArrowRight className="w-5 h-5 text-[#F5BA13]" />
              </button>

              <button
                onClick={onViewLocations}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#F8F9F5] hover:bg-white text-[#0C1E17] font-extrabold text-base px-8 py-4 rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-98"
              >
                <MapPin className="w-5 h-5 text-[#00843D]" />
                <span>Find Locations</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Proof Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="text-left bg-white/5 rounded-2xl p-3 border border-emerald-500/20">
                <div className="text-2xl font-black text-[#F5BA13]">100/=</div>
                <div className="text-xs text-gray-300 font-medium">Max Meal Price</div>
              </div>
              <div className="text-left bg-white/5 rounded-2xl p-3 border border-emerald-500/20">
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-xs text-gray-300 font-medium">Never-Frozen</div>
              </div>
              <div className="text-left bg-white/5 rounded-2xl p-3 border border-emerald-500/20">
                <div className="text-2xl font-black text-emerald-400">8+ Hubs</div>
                <div className="text-xs text-gray-300 font-medium">Across Kenya</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00843D] to-[#F5BA13] rounded-3xl blur-2xl opacity-25 transform -rotate-2" />

              <div className="relative bg-[#0F291E] border border-emerald-500/30 rounded-3xl p-5 shadow-2xl overflow-hidden">
                {/* Floating "Chakula Chini Ya Soo" Badge */}
                <div className="absolute top-4 right-4 z-20 bg-[#00843D] text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 border border-emerald-400/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5BA13]" />
                  <span>KULA NA SOO MOJA</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-5 bg-[#081C15]">
                  <img
                    src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80"
                    alt="Chapo Madondo Kenyan 100 Bob Meal"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xs font-bold text-[#F5BA13] tracking-wide uppercase block">Hot & Fresh</span>
                    <span className="text-lg font-black">Chapo Madondo na Kachumbari</span>
                  </div>
                </div>

                {/* Interactive Card Highlights */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#00843D]/30 text-emerald-300 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                        2x
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Layered Wheat Chapatis</div>
                        <div className="text-xs text-gray-400">Fresh from tawa iron skillet</div>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-[#F5BA13]">40 KSh</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                        1x
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Yellow Beans Stew + Sababisha</div>
                        <div className="text-xs text-gray-400">Simmered with garlic & tomatoes</div>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-[#F5BA13]">40 KSh</span>
                  </div>

                  {/* Total Bar */}
                  <div className="flex items-center justify-between pt-2 px-1">
                    <span className="text-sm font-bold text-gray-300">Total Plate Price:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#F5BA13]">80</span>
                      <span className="text-xs font-bold text-emerald-300">KSh (Save 20 Bob)</span>
                    </div>
                  </div>

                  <button
                    onClick={onOpenPlateBuilder}
                    className="w-full mt-2 py-3 rounded-xl bg-[#F5BA13] hover:bg-[#e0a80d] text-[#0C1E17] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Build Your Own 100 Bob Plate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
