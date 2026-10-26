/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  X,
  Cloud,
  LogOut,
  PlusCircle,
  Utensils,
  Home,
  MapPin,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Info,
  ArrowUp,
  Search,
  Bookmark,
  Zap,
  Layers,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { User } from 'firebase/auth';

interface NavbarProps {
  user: User | null;
  onOpenDriveModal: () => void;
  onOpenSubmitSpotModal: () => void;
  onLogout: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  savedSpotsCount: number;
  onOpenQuickLinksModal?: () => void;
  onOpenBudgetTracker?: () => void;
  totalBudgetSpent?: number;
  dailyBudgetGoal?: number;
}

export default function Navbar({
  user,
  onOpenDriveModal,
  onOpenSubmitSpotModal,
  onLogout,
  activeSection,
  onNavigate,
  savedSpotsCount,
  onOpenQuickLinksModal,
  onOpenBudgetTracker,
  totalBudgetSpent = 0,
  dailyBudgetGoal = 100,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Monitor scroll for compact header & back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 25);
      setShowBackToTop(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut for Quick Links (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenQuickLinksModal?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenQuickLinksModal]);

  const navLinks = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'menu', label: 'The Menu', icon: Utensils, badge: '6' },
    { id: 'locations', label: 'Locations', icon: MapPin, badge: '8+' },
    { id: 'plate-builder', label: '100 Bob Plate', icon: Sparkles, badge: 'DIY' },
    { id: 'values', label: 'Our Values', icon: ShieldCheck },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#081C15]/95 backdrop-blur-xl border-b border-emerald-500/25 shadow-lg shadow-emerald-950/20 py-2.5'
            : 'bg-[#081C15]/90 backdrop-blur-md border-b border-emerald-500/15 py-4'
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="text-left focus:outline-none focus:ring-2 focus:ring-[#00843D] rounded-xl p-1 transition-transform hover:scale-[1.02] flex-shrink-0"
          >
            <BrandLogo variant="light" size={isScrolled ? 'sm' : 'md'} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#00843D] text-white shadow-sm shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F5BA13]' : 'text-emerald-400/70'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-tight ${
                        isActive
                          ? 'bg-[#F5BA13] text-[#081C15]'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Search Shortcut */}
            <button
              onClick={() => handleLinkClick('locations')}
              title="Quick Search 100 Bob spots"
              className="p-2 rounded-full text-emerald-200 hover:text-white bg-white/5 hover:bg-white/10 border border-emerald-500/20 transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Daily Budget Tracker Live Pill */}
            {onOpenBudgetTracker && (
              <button
                onClick={onOpenBudgetTracker}
                title="Daily 100 Bob Meal Budget Tracker"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm border ${
                  totalBudgetSpent > dailyBudgetGoal
                    ? 'bg-red-950/80 border-red-500/60 text-red-200 hover:bg-red-900'
                    : 'bg-emerald-950/80 border-emerald-400/50 text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    totalBudgetSpent > dailyBudgetGoal ? 'bg-red-400 animate-ping' : 'bg-[#F5BA13] animate-pulse'
                  }`}
                />
                <span className="font-extrabold">{totalBudgetSpent}/{dailyBudgetGoal} Bob</span>
              </button>
            )}

            {/* Quick Links Command Hub */}
            {onOpenQuickLinksModal && (
              <button
                onClick={onOpenQuickLinksModal}
                title="Quick Links & Command Hub (⌘K)"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-200 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 rounded-full border border-emerald-500/30 transition-all active:scale-95 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-[#F5BA13] fill-[#F5BA13]" />
                <span className="hidden xl:inline">Quick Links</span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/40 text-emerald-300">⌘K</span>
              </button>
            )}

            {/* Submit Spot Button */}
            <button
              onClick={onOpenSubmitSpotModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-100 hover:text-white bg-emerald-900/40 hover:bg-emerald-800/50 rounded-full border border-emerald-500/30 transition-all active:scale-95 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#F5BA13]" />
              <span>Add Spot</span>
            </button>

            {/* Google Drive Status Button */}
            <button
              onClick={onOpenDriveModal}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all active:scale-95 ${
                user
                  ? 'bg-emerald-950/80 border-emerald-400/60 text-emerald-300 hover:bg-emerald-900/80 shadow-sm'
                  : 'bg-white/10 border-white/20 text-gray-200 hover:bg-white/15'
              }`}
            >
              <Cloud className={`w-4 h-4 ${user ? 'text-emerald-400' : 'text-blue-400'}`} />
              <span>{user ? 'Drive Sync' : 'Google Drive'}</span>
              {savedSpotsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#00843D] text-white text-[11px] font-black flex items-center justify-center shadow-sm">
                  {savedSpotsCount}
                </span>
              )}
            </button>

            {/* Order / Find Button */}
            <button
              onClick={() => handleLinkClick('locations')}
              className="flex items-center gap-2 bg-[#00843D] hover:bg-[#006e33] text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-95 border border-emerald-400/30"
            >
              <Utensils className="w-3.5 h-3.5 text-[#F5BA13]" />
              <span>Find Meals</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenDriveModal}
              aria-label="Google Drive sync"
              className="p-2 rounded-full bg-white/10 text-white relative active:scale-90 transition-transform"
            >
              <Cloud className="w-5 h-5 text-emerald-300" />
              {savedSpotsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00843D] text-white text-[10px] font-bold flex items-center justify-center">
                  {savedSpotsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors focus:outline-none"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb-friendly app-like UX) */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081C15]/95 backdrop-blur-xl border-t border-emerald-500/20 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom"
      >
        {[
          { id: 'hero', label: 'Home', icon: Home },
          { id: 'menu', label: 'Menu', icon: Utensils },
          { id: 'locations', label: 'Spots', icon: MapPin },
          { id: 'plate-builder', label: 'DIY Plate', icon: Sparkles },
        ].map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#F5BA13] scale-105 font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#00843D] text-white shadow-sm' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* 5th Mobile Bottom Item: Google Drive / Saved spots */}
        <button
          onClick={onOpenDriveModal}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-gray-400 hover:text-gray-200 relative transition-all"
        >
          <div className="p-1 rounded-xl bg-white/5 relative">
            <Cloud className="w-4 h-4 text-emerald-400" />
            {savedSpotsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#00843D] text-white text-[8px] font-black flex items-center justify-center">
                {savedSpotsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Saved</span>
        </button>
      </nav>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          title="Scroll back to top"
          aria-label="Scroll back to top"
          className="fixed bottom-20 sm:bottom-8 right-5 z-40 w-11 h-11 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white shadow-xl shadow-emerald-950/60 border border-emerald-400/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-fade-in"
        >
          <ArrowUp className="w-5 h-5 text-[#F5BA13] stroke-[2.5]" />
        </button>
      )}

      {/* Full Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#F8F9F5] text-[#0C1E17] h-full shadow-2xl flex flex-col p-6 overflow-y-auto border-r border-emerald-900/10 animate-fade-in">
            {/* Top header with logo and close button */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-200">
              <BrandLogo variant="dark" size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Overview Pill */}
            <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Kenyan Budget Dining
                </div>
                <div className="text-xs font-bold text-gray-800">
                  Meals strictly 100 Bob or less
                </div>
              </div>
              <span className="text-xs font-black bg-[#00843D] text-white px-2 py-0.5 rounded-full">
                100/= Max
              </span>
            </div>

            {/* Nav list with Icons */}
            <div className="flex flex-col gap-1.5 py-5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-[#00843D] text-white shadow-sm'
                        : 'text-gray-800 hover:bg-gray-100 hover:text-[#00843D]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5BA13]' : 'text-[#00843D]'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          isActive
                            ? 'bg-[#F5BA13] text-[#0C1E17]'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Extra Mobile Actions */}
            <div className="mt-auto pt-4 border-t border-gray-200 space-y-2.5">
              {onOpenBudgetTracker && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBudgetTracker();
                  }}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all ${
                    totalBudgetSpent > dailyBudgetGoal
                      ? 'bg-red-100 text-red-900 border border-red-300'
                      : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00843D] animate-pulse" />
                    <span>Daily Budget Tracker</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-gray-900 font-black">
                    {totalBudgetSpent}/{dailyBudgetGoal} Bob
                  </span>
                </button>
              )}

              {onOpenQuickLinksModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuickLinksModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-emerald-800"
                >
                  <Zap className="w-4 h-4 text-[#F5BA13] fill-[#F5BA13]" />
                  <span>Quick Links & Fast Jumps</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSubmitSpotModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-wider border border-emerald-200"
              >
                <PlusCircle className="w-4 h-4 text-[#00843D]" />
                <span>Submit A 100 Bob Spot</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDriveModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase tracking-wider border border-gray-300"
              >
                <Cloud className="w-4 h-4 text-[#00843D]" />
                <span>
                  {user ? `Google Drive (${user.displayName || 'Connected'})` : 'Connect Google Drive'}
                </span>
                {savedSpotsCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-[#00843D] text-white rounded-full font-bold">
                    {savedSpotsCount} saved
                  </span>
                )}
              </button>

              <button
                onClick={() => handleLinkClick('locations')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white font-extrabold text-xs uppercase tracking-wider shadow-md"
              >
                <span>Find Food Near You</span>
                <span>→</span>
              </button>

              {user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs text-red-600 hover:underline pt-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out of {user.email}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
