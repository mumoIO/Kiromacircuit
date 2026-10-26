/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Flame,
  Utensils,
  MapPin,
  Sparkles,
  Leaf,
  Cloud,
  PlusCircle,
  Zap,
  TrendingUp,
  Compass,
  Layers,
  DollarSign,
} from 'lucide-react';

interface QuickLinksBarProps {
  onNavigate: (sectionId: string) => void;
  onOpenDriveModal: () => void;
  onOpenSubmitSpotModal: () => void;
  onOpenQuickLinksModal?: () => void;
  onOpenBudgetTracker?: () => void;
  totalBudgetSpent?: number;
  dailyBudgetGoal?: number;
}

export default function QuickLinksBar({
  onNavigate,
  onOpenDriveModal,
  onOpenSubmitSpotModal,
  onOpenQuickLinksModal,
  onOpenBudgetTracker,
  totalBudgetSpent = 0,
  dailyBudgetGoal = 100,
}: QuickLinksBarProps) {
  const quickLinks = [
    ...(onOpenBudgetTracker
      ? [
          {
            label: `Daily Budget (${totalBudgetSpent}/${dailyBudgetGoal} Bob)`,
            icon: DollarSign,
            badge: totalBudgetSpent > dailyBudgetGoal ? 'OVER' : 'TRACK',
            action: onOpenBudgetTracker,
            badgeColor:
              totalBudgetSpent > dailyBudgetGoal
                ? 'bg-red-500 text-white'
                : 'bg-[#F5BA13] text-black',
          },
        ]
      : []),
    {
      label: 'Trending Spots',
      icon: Flame,
      badge: 'HOT',
      action: () => onNavigate('locations'),
      badgeColor: 'bg-amber-400 text-black',
    },
    {
      label: 'Chapo Madondo (80/=)',
      icon: Utensils,
      action: () => onNavigate('menu'),
    },
    {
      label: 'Double Smocha (70/=)',
      icon: Zap,
      action: () => onNavigate('menu'),
    },
    {
      label: 'Healthy Choices',
      icon: Leaf,
      badge: 'Nutritious',
      action: () => onNavigate('menu'),
      badgeColor: 'bg-emerald-200 text-emerald-950',
    },
    {
      label: 'DIY 100 Bob Plate',
      icon: Sparkles,
      action: () => onNavigate('plate-builder'),
    },
    {
      label: 'Nairobi CBD & Ngara',
      icon: MapPin,
      action: () => onNavigate('locations'),
    },
    {
      label: 'Mombasa Coastal Bites',
      icon: Compass,
      action: () => onNavigate('locations'),
    },
    {
      label: 'Kisumu Lakeside Omena',
      icon: MapPin,
      action: () => onNavigate('locations'),
    },
    {
      label: 'Sync to Google Drive',
      icon: Cloud,
      action: onOpenDriveModal,
      badgeColor: 'bg-blue-200 text-blue-900',
    },
    {
      label: 'Add A Kibanda',
      icon: PlusCircle,
      action: onOpenSubmitSpotModal,
    },
  ];

  return (
    <div className="bg-[#061711] border-y border-emerald-500/20 py-3 px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Quick Links Label */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#F5BA13] flex-shrink-0 pr-3 border-r border-emerald-500/25">
          <div className="w-5 h-5 rounded-md bg-[#F5BA13]/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 fill-[#F5BA13] text-[#F5BA13]" />
          </div>
          <span className="hidden sm:inline">Quick Links:</span>
          <span className="sm:hidden">Jump:</span>
        </div>

        {/* Scrollable Pills Row */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 pr-2">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 hover:text-white border border-emerald-500/25 text-xs font-bold whitespace-nowrap transition-all hover:scale-[1.03] active:scale-95 shadow-sm flex-shrink-0"
              >
                <Icon className="w-3.5 h-3.5 text-[#F5BA13]" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                      item.badgeColor || 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View All Links Hub Button */}
        {onOpenQuickLinksModal && (
          <button
            onClick={onOpenQuickLinksModal}
            className="flex-shrink-0 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-800/60 hover:bg-[#00843D] text-white text-xs font-bold border border-emerald-400/30 transition-all hover:scale-[1.03] active:scale-95 shadow-sm"
            title="Open Complete Quick Links Hub"
          >
            <Layers className="w-3.5 h-3.5 text-[#F5BA13]" />
            <span>All Links</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono text-emerald-200">⌘K</span>
          </button>
        )}
      </div>
    </div>
  );
}
