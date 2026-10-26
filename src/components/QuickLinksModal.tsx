/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Zap,
  Utensils,
  MapPin,
  Sparkles,
  Cloud,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Leaf,
  Heart,
  Briefcase,
  ShieldCheck,
  Info,
  Home,
  Compass,
  DollarSign,
} from 'lucide-react';

interface QuickLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenDriveModal: () => void;
  onOpenSubmitSpotModal: () => void;
  onOpenBudgetTracker?: () => void;
}

interface QuickLinkItem {
  id: string;
  title: string;
  category: 'Sections' | 'Signature Meals' | 'Hotspot Locations' | 'Tools & Services';
  subtitle?: string;
  price?: string;
  badge?: string;
  badgeColor?: string;
  icon: any;
  action: () => void;
  keywords: string[];
}

export default function QuickLinksModal({
  isOpen,
  onClose,
  onNavigate,
  onOpenDriveModal,
  onOpenSubmitSpotModal,
  onOpenBudgetTracker,
}: QuickLinksModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  const allLinks: QuickLinkItem[] = useMemo(
    () => [
      // Sections
      {
        id: 'sec-home',
        title: 'Home / Hero Banner',
        subtitle: 'Top of page, brand introduction & meal highlight',
        category: 'Sections',
        icon: Home,
        keywords: ['home', 'hero', 'start', 'top', 'banner', 'kenya'],
        action: () => {
          onNavigate('hero');
          onClose();
        },
      },
      {
        id: 'sec-menu',
        title: 'Signature 100 Bob Menu',
        subtitle: 'Explore 6 full-sized meals with nutrition details',
        category: 'Sections',
        badge: '6 Meals',
        badgeColor: 'bg-emerald-600 text-white',
        icon: Utensils,
        keywords: ['menu', 'food', 'meals', 'eat', 'dishes', 'chapo', 'ugali', 'smocha'],
        action: () => {
          onNavigate('menu');
          onClose();
        },
      },
      {
        id: 'sec-locations',
        title: 'Locations Directory & Map',
        subtitle: 'Verified kibandas across Nairobi, Mombasa, Kisumu, Nakuru, Eldoret',
        category: 'Sections',
        badge: '8+ Hubs',
        badgeColor: 'bg-[#F5BA13] text-black',
        icon: MapPin,
        keywords: ['locations', 'directory', 'map', 'hotels', 'kibanda', 'restaurants', 'spots', 'nairobi'],
        action: () => {
          onNavigate('locations');
          onClose();
        },
      },
      {
        id: 'sec-plate',
        title: '100 Bob Plate Builder',
        subtitle: 'Custom DIY meal builder with live budget gauge and Google Drive sync',
        category: 'Sections',
        badge: 'DIY Tool',
        badgeColor: 'bg-emerald-500 text-white',
        icon: Sparkles,
        keywords: ['plate', 'builder', 'diy', 'custom', 'budget', 'combo', 'kula', 'build'],
        action: () => {
          onNavigate('plate-builder');
          onClose();
        },
      },
      {
        id: 'sec-values',
        title: 'Transparency & Core Values',
        subtitle: 'Fixed 100 Bob cap, hygiene scores, and verified local ingredients',
        category: 'Sections',
        icon: ShieldCheck,
        keywords: ['values', 'hygiene', 'transparency', 'quality', 'mission', 'trust'],
        action: () => {
          onNavigate('values');
          onClose();
        },
      },
      {
        id: 'sec-careers',
        title: 'Careers & Hiring',
        subtitle: 'Open roles for spot verifiers, field community leads, and chefs',
        category: 'Sections',
        badge: 'Hiring',
        badgeColor: 'bg-amber-500 text-black',
        icon: Briefcase,
        keywords: ['careers', 'jobs', 'hiring', 'work', 'apply', 'lead', 'verifier'],
        action: () => {
          onNavigate('careers');
          onClose();
        },
      },
      {
        id: 'sec-about',
        title: 'About 100-Meal Kenya',
        subtitle: 'Our story, 100 Bob movement, and community manifesto',
        category: 'Sections',
        icon: Info,
        keywords: ['about', 'story', 'history', 'founder', 'manifesto', 'kenya'],
        action: () => {
          onNavigate('about');
          onClose();
        },
      },

      // Signature Meals
      {
        id: 'meal-chapo',
        title: 'Chapo Madondo Special',
        subtitle: '2 soft layered chapatis + thick yellow bean stew & kachumbari',
        price: '80 KSh',
        category: 'Signature Meals',
        badge: 'Popular',
        badgeColor: 'bg-emerald-700 text-white',
        icon: Utensils,
        keywords: ['chapo', 'madondo', 'beans', 'chapati', 'dondo', 'kachumbari', '80'],
        action: () => {
          onNavigate('menu');
          onClose();
        },
      },
      {
        id: 'meal-smocha',
        title: 'Double Smocha Deluxe',
        subtitle: '2 smoked sausages wrapped in fresh warm chapo with tomato-kachumbari',
        price: '70 KSh',
        category: 'Signature Meals',
        badge: 'Street Hit',
        badgeColor: 'bg-amber-400 text-black',
        icon: Flame,
        keywords: ['smocha', 'sausage', 'chapati', 'street', 'fast', '70'],
        action: () => {
          onNavigate('menu');
          onClose();
        },
      },
      {
        id: 'meal-ugali-sukuma',
        title: 'Ugali Sukuma na Supu',
        subtitle: 'Generous cornmeal ugali with sauteed collard greens and savory bone marrow broth',
        price: '90 KSh',
        category: 'Signature Meals',
        badge: 'Healthy',
        badgeColor: 'bg-emerald-600 text-white',
        icon: Leaf,
        keywords: ['ugali', 'sukuma', 'greens', 'supu', 'broth', '90', 'spinach'],
        action: () => {
          onNavigate('menu');
          onClose();
        },
      },
      {
        id: 'meal-githeri',
        title: 'Githeri na Hass Avocado',
        subtitle: 'Boiled corn and beans slow-simmered in onions and tomatoes + fresh Hass avocado',
        price: '85 KSh',
        category: 'Signature Meals',
        badge: 'Superfood',
        badgeColor: 'bg-emerald-700 text-white',
        icon: Leaf,
        keywords: ['githeri', 'avocado', 'beans', 'corn', 'healthy', '85'],
        action: () => {
          onNavigate('menu');
          onClose();
        },
      },
      {
        id: 'meal-omena',
        title: 'Ugali Lake Omena Plate',
        subtitle: 'Fresh sun-dried silver cyprinid fish pan-fried with onions, tomatoes & ugali',
        price: '95 KSh',
        category: 'Signature Meals',
        badge: 'Omega-3',
        badgeColor: 'bg-blue-600 text-white',
        icon: Utensils,
        keywords: ['omena', 'fish', 'lake', 'victoria', 'ugali', 'omega', '95'],
        action: () => {
          onNavigate('menu');
          onClose();
        },
      },
      {
        id: 'meal-chips',
        title: 'Chips Mwitu na Sausage',
        subtitle: 'Freshly cut deep-fried potato fries seasoned with chili salt + beef sausage',
        price: '90 KSh',
        category: 'Signature Meals',
        badge: 'Fast Bite',
        badgeColor: 'bg-amber-400 text-black',
        icon: Zap,
        keywords: ['chips', 'mwitu', 'fries', 'sausage', 'potato', 'chili', '90'],
        action: () => {
          onNavigate('menu');
          onClose();
        },
      },

      // Hotspots
      {
        id: 'loc-nairobi-cbd',
        title: 'Nairobi CBD & River Road Hub',
        subtitle: 'Mama Oliech Annex, CBD Express Kibanda, Tom Mboya Street',
        category: 'Hotspot Locations',
        badge: '3 Spots',
        badgeColor: 'bg-emerald-800 text-white',
        icon: MapPin,
        keywords: ['nairobi', 'cbd', 'river road', 'tom mboya', 'city'],
        action: () => {
          onNavigate('locations');
          onClose();
        },
      },
      {
        id: 'loc-ngara',
        title: 'Ngara & Fig Tree Market Hotspots',
        subtitle: 'Kibanda Tamu Fig Tree - student & commuter hotspot',
        category: 'Hotspot Locations',
        badge: 'Top Rated',
        badgeColor: 'bg-[#F5BA13] text-black',
        icon: MapPin,
        keywords: ['ngara', 'fig tree', 'market', 'chapo', 'student'],
        action: () => {
          onNavigate('locations');
          onClose();
        },
      },
      {
        id: 'loc-mombasa',
        title: 'Mombasa Old Town & Coast Spots',
        subtitle: 'Swahili Mahamri Corner, Coastal Biryani Kibanda',
        category: 'Hotspot Locations',
        badge: 'Coast',
        badgeColor: 'bg-teal-700 text-white',
        icon: Compass,
        keywords: ['mombasa', 'coast', 'swahili', 'mahamri', 'old town', 'bamburi'],
        action: () => {
          onNavigate('locations');
          onClose();
        },
      },
      {
        id: 'loc-kisumu',
        title: 'Kisumu Kondele & Lakeside Spots',
        subtitle: 'Lake Fish Omena Joint, fresh ugali & lakeside dining',
        category: 'Hotspot Locations',
        badge: 'Lakeside',
        badgeColor: 'bg-blue-700 text-white',
        icon: MapPin,
        keywords: ['kisumu', 'kondele', 'lake', 'omena', 'fish'],
        action: () => {
          onNavigate('locations');
          onClose();
        },
      },
      {
        id: 'loc-nakuru',
        title: 'Nakuru Town & Free Area',
        subtitle: 'Rift Valley Fresh Githeri & Chapo Hub',
        category: 'Hotspot Locations',
        badge: 'Rift Valley',
        badgeColor: 'bg-emerald-900 text-white',
        icon: MapPin,
        keywords: ['nakuru', 'rift valley', 'free area', 'town'],
        action: () => {
          onNavigate('locations');
          onClose();
        },
      },

      // Tools & Services
      {
        id: 'tool-drive',
        title: 'Google Drive Sync & Backup',
        subtitle: 'Backup your saved kibandas and custom combo menus to your Google Drive',
        category: 'Tools & Services',
        badge: 'OAuth 2.0',
        badgeColor: 'bg-blue-500 text-white',
        icon: Cloud,
        keywords: ['google', 'drive', 'sync', 'backup', 'cloud', 'save', 'oauth'],
        action: () => {
          onClose();
          onOpenDriveModal();
        },
      },
      {
        id: 'tool-submit',
        title: 'Submit A New Kibanda Spot',
        subtitle: 'Add your neighborhood 100 Bob gem with camera photo & meal prices',
        category: 'Tools & Services',
        badge: 'Community',
        badgeColor: 'bg-emerald-600 text-white',
        icon: PlusCircle,
        keywords: ['submit', 'add', 'kibanda', 'new', 'spot', 'eatery', 'restaurant', 'camera'],
        action: () => {
          onClose();
          onOpenSubmitSpotModal();
        },
      },
      {
        id: 'tool-plate-diy',
        title: 'DIY Plate Customizer',
        subtitle: 'Build a custom combination: Chapo + Ndondo + Greens under 100/= with real-time budget meter',
        category: 'Tools & Services',
        badge: 'Kula Na 100',
        badgeColor: 'bg-[#F5BA13] text-black',
        icon: Sparkles,
        keywords: ['diy', 'plate', 'custom', 'meter', 'kula', '100 bob'],
        action: () => {
          onNavigate('plate-builder');
          onClose();
        },
      },
      {
        id: 'tool-budget-tracker',
        title: 'Daily 100 Bob Budget Tracker',
        subtitle: 'Log and monitor today’s meal spending to ensure you stay under your 100 Bob goal',
        category: 'Tools & Services',
        badge: 'Live Tracker',
        badgeColor: 'bg-emerald-600 text-white',
        icon: DollarSign,
        keywords: ['budget', 'tracker', 'spend', 'goal', 'daily', '100 bob', 'money', 'kula', 'log', 'meals'],
        action: () => {
          onClose();
          onOpenBudgetTracker?.();
        },
      },
    ],
    [onNavigate, onClose, onOpenDriveModal, onOpenSubmitSpotModal, onOpenBudgetTracker]
  );

  const categories = ['all', 'Sections', 'Signature Meals', 'Hotspot Locations', 'Tools & Services'];

  const filteredLinks = useMemo(() => {
    let result = allLinks;

    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          item.keywords.some((kw) => kw.includes(q))
      );
    }

    return result;
  }, [allLinks, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#061711]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#081C15] text-white rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/20 bg-[#061711]/90">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00843D] flex items-center justify-center shadow-md shadow-emerald-950/50">
                <Zap className="w-4 h-4 text-[#F5BA13] fill-[#F5BA13]" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Quick Links & Fast Jumps</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 hidden sm:inline-block">
                    Command Hub
                  </span>
                </h3>
                <p className="text-xs text-emerald-200/70">
                  Instant access to every section, 100 Bob meal, verified kibanda, and tool.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close Quick Links"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quick links (e.g. chapo, map, plate, ngara, drive)..."
              autoFocus
              className="w-full bg-[#030d09] border border-emerald-500/30 focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/50 text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm placeholder-gray-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-md bg-white/10"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all text-xs ${
                  activeCategory === cat
                    ? 'bg-[#00843D] text-white shadow-sm'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Quick Links' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Links List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 divide-y divide-emerald-500/10">
          {filteredLinks.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-300">No quick links matching &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-gray-500">
                Try searching for &quot;chapo&quot;, &quot;drive&quot;, &quot;locations&quot;, or &quot;plate&quot;
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-1.5 rounded-full bg-[#00843D] text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full text-left pt-2.5 first:pt-0 pb-1.5 group flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-emerald-950/60 transition-all border border-transparent hover:border-emerald-500/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-900/50 group-hover:bg-[#00843D] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-4 h-4 text-[#F5BA13] group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors">
                          {item.title}
                        </span>
                        {item.price && (
                          <span className="text-xs font-black text-[#F5BA13] bg-[#030d09] px-2 py-0.5 rounded-full border border-amber-500/30">
                            {item.price}
                          </span>
                        )}
                        {item.badge && (
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              item.badgeColor || 'bg-white/20 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-gray-400 group-hover:text-gray-300 truncate max-w-sm sm:max-w-md">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-emerald-300 transition-colors flex-shrink-0">
                    <span className="text-[10px] font-semibold hidden sm:inline">Jump</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="p-3 sm:p-4 border-t border-emerald-500/20 bg-[#061711] flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px]">ESC</span>
            <span>to close</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Click any link for instant smooth jump</span>
          </div>
          <div className="flex items-center gap-1 text-[#F5BA13] font-bold text-xs">
            <Zap className="w-3.5 h-3.5" />
            <span>Fast Navigation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
