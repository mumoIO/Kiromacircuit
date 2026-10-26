/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Cloud, MapPin, Utensils, Sparkles, PlusCircle, Bookmark, ExternalLink, Zap } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenDriveModal: () => void;
  onOpenSubmitSpotModal?: () => void;
  onOpenQuickLinksModal?: () => void;
}

export default function Footer({
  onNavigate,
  onOpenDriveModal,
  onOpenSubmitSpotModal,
  onOpenQuickLinksModal,
}: FooterProps) {
  return (
    <footer className="bg-[#081C15] text-white pt-16 pb-12 border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-500/15">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" size="lg" />
            <p className="text-sm text-emerald-100/70 font-medium leading-relaxed max-w-sm pt-2">
              At 100-Meal Kenya, we celebrate fresh, simple, affordable street food. Our menu is small by design to deliver consistent quality, lightning speed, and maximum nutritional value for every Kenyan on a 100 Bob budget.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cashless M-Pesa Till Enabled at All Spots</span>
              </span>
            </div>
          </div>

          {/* Column 1: Main Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#F5BA13] flex items-center gap-1.5">
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  The Menu (6 Meals)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('locations')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Locations Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plate-builder')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  100 Bob Plate Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('values')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Our Core Values
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('careers')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Careers & Hiring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About 100-Meal
                </button>
              </li>
              {onOpenQuickLinksModal && (
                <li className="pt-2">
                  <button
                    onClick={onOpenQuickLinksModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/60 hover:bg-[#00843D] text-[#F5BA13] hover:text-white border border-emerald-500/30 text-[11px] font-bold transition-all shadow-sm active:scale-95"
                  >
                    <Zap className="w-3 h-3 fill-[#F5BA13]" />
                    <span>Quick Links Hub (⌘K)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 2: Popular 100 Bob Meals Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>100 Bob Favorites</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-emerald-400 transition-colors flex items-center justify-between w-full pr-4"
                >
                  <span>Chapo Madondo Special</span>
                  <span className="text-[#F5BA13] font-bold">80/=</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-emerald-400 transition-colors flex items-center justify-between w-full pr-4"
                >
                  <span>Double Smocha Deluxe</span>
                  <span className="text-[#F5BA13] font-bold">70/=</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-emerald-400 transition-colors flex items-center justify-between w-full pr-4"
                >
                  <span>Ugali Sukuma na Supu</span>
                  <span className="text-[#F5BA13] font-bold">90/=</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-emerald-400 transition-colors flex items-center justify-between w-full pr-4"
                >
                  <span>Githeri na Hass Avocado</span>
                  <span className="text-[#F5BA13] font-bold">85/=</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-emerald-400 transition-colors flex items-center justify-between w-full pr-4"
                >
                  <span>Ugali Lake Omena Plate</span>
                  <span className="text-[#F5BA13] font-bold">95/=</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-emerald-400 transition-colors flex items-center justify-between w-full pr-4"
                >
                  <span>Chips Mwitu na Sausage</span>
                  <span className="text-[#F5BA13] font-bold">90/=</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tools, Drive & Hubs Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5" />
              <span>Tools & Hubs</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              <li>
                <button
                  onClick={onOpenDriveModal}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-emerald-400 font-bold"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Google Drive Sync</span>
                </button>
              </li>
              {onOpenSubmitSpotModal && (
                <li>
                  <button
                    onClick={onOpenSubmitSpotModal}
                    className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#F5BA13]" />
                    <span>Submit A New Kibanda</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onNavigate('locations')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-[#F5BA13]" />
                  <span>Nairobi CBD & Ngara</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('locations')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-[#F5BA13]" />
                  <span>Mombasa Old Town Kibokoni</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('locations')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-[#F5BA13]" />
                  <span>Kisumu Lakeside & Nakuru</span>
                </button>
              </li>
            </ul>

            {/* Social & Contact */}
            <div className="pt-3 border-t border-emerald-500/15">
              <div className="flex items-center gap-2 mb-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white flex items-center justify-center font-black text-xs shadow-md transition-all active:scale-95 border border-emerald-400/30"
                >
                  f
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white flex items-center justify-center font-black text-xs shadow-md transition-all active:scale-95 border border-emerald-400/30"
                >
                  ig
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white flex items-center justify-center font-black text-xs shadow-md transition-all active:scale-95 border border-emerald-400/30"
                >
                  𝕏
                </a>
              </div>
              <a
                href="mailto:hello@100kshmeals.co.ke"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-200/80 hover:text-white font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-[#F5BA13]" />
                <span>hello@100kshmeals.co.ke</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-emerald-100/50 uppercase tracking-widest gap-2">
          <span>© 2026 100-MEAL KENYA. ALL RIGHTS RESERVED.</span>
          <span className="text-[11px] normal-case tracking-normal text-emerald-300/70 font-medium">
            Affordable, dignity-packed 100 Bob meals for all Kenyans.
          </span>
        </div>
      </div>
    </footer>
  );
}
