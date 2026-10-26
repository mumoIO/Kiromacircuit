/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickLinksBar from './components/QuickLinksBar';
import SignatureMeals from './components/SignatureMeals';
import LocationsSection from './components/LocationsSection';
import PlateBuilder from './components/PlateBuilder';
import ValuesSection from './components/ValuesSection';
import CareersSection from './components/CareersSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import GoogleDriveModal from './components/GoogleDriveModal';
import SubmitSpotModal from './components/SubmitSpotModal';
import LocationDetailModal from './components/LocationDetailModal';
import QuickLinksModal from './components/QuickLinksModal';
import DailyBudgetTracker from './components/DailyBudgetTracker';
import FloatingBudgetWidget from './components/FloatingBudgetWidget';

import { initAuth, googleSignIn, logout } from './services/firebase';
import { MealItem, HotelLocation, DriveSavedSpot, EateryReview, DailyBudgetExpense } from './types';
import { HOTEL_LOCATIONS, INITIAL_REVIEWS } from './data/mealsAndLocations';

export default function App() {
  // Auth state per Google Workspace Skill guidelines
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Modals state
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isSubmitSpotModalOpen, setIsSubmitSpotModalOpen] = useState(false);
  const [isQuickLinksModalOpen, setIsQuickLinksModalOpen] = useState(false);
  const [isBudgetTrackerOpen, setIsBudgetTrackerOpen] = useState(false);
  const [selectedLocationForModal, setSelectedLocationForModal] = useState<HotelLocation | null>(null);

  // Daily Budget Tracker state
  const [dailyBudgetGoal, setDailyBudgetGoal] = useState<number>(100);
  const [dailyExpenses, setDailyExpenses] = useState<DailyBudgetExpense[]>(() => {
    try {
      const stored = localStorage.getItem('100bob_daily_expenses');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'init-1',
        mealName: 'Chapo Mbili & Spiced Milk Tea',
        cost: 30,
        time: '8:15 AM',
        category: 'breakfast',
        spotName: 'CBD Express Kibanda',
      },
      {
        id: 'init-2',
        mealName: 'Single Smoky Smocha',
        cost: 40,
        time: '1:10 PM',
        category: 'lunch',
        spotName: 'Ngara Fig Tree',
      },
    ];
  });

  // Save expenses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('100bob_daily_expenses', JSON.stringify(dailyExpenses));
    } catch (e) {
      console.warn('Could not save expenses to localStorage', e);
    }
  }, [dailyExpenses]);

  const handleAddBudgetExpense = (expense: Omit<DailyBudgetExpense, 'id' | 'time'>) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry: DailyBudgetExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
      time: timeNow,
    };
    setDailyExpenses([newEntry, ...dailyExpenses]);
    showToast(`Logged "${expense.mealName}" (+${expense.cost} KSh) to daily budget!`);
  };

  const handleRemoveBudgetExpense = (id: string) => {
    setDailyExpenses(dailyExpenses.filter((e) => e.id !== id));
    showToast('Removed meal entry from daily budget.');
  };

  const handleResetTodayBudget = () => {
    setDailyExpenses([]);
    showToast('Cleared today\'s meal budget log.');
  };

  const totalBudgetSpent = dailyExpenses.reduce((sum, item) => sum + item.cost, 0);

  // Active section for navbar highlighting
  const [activeSection, setActiveSection] = useState('hero');

  // Locations state (allows user community submissions)
  const [locations, setLocations] = useState<HotelLocation[]>(HOTEL_LOCATIONS);

  // Community reviews state
  const [reviews, setReviews] = useState<EateryReview[]>(INITIAL_REVIEWS);

  // Saved spots for Google Drive sync
  const [savedSpots, setSavedSpots] = useState<DriveSavedSpot[]>([
    {
      spotId: 'nairobi-cbd-firestation',
      spotName: 'Kibanda Kings — Fire Station',
      city: 'Nairobi',
      neighborhood: 'Nairobi CBD',
      meal: 'Chapo Madondo Special',
      price: 80,
      notes: 'Ask for Sababisha meat broth splash. Fresh chapatis from 12pm.',
      savedAt: '2026-10-05',
    },
    {
      spotId: 'ngara-figtree',
      spotName: 'Fig Tree Hotspot Diner',
      city: 'Nairobi',
      neighborhood: 'Ngara',
      meal: 'Double Smocha Deluxe',
      price: 70,
      notes: 'Best kachumbari in Ngara. Open until late.',
      savedAt: '2026-10-05',
    },
  ]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, token) => {
        setUser(authUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Support shared eatery links (e.g. ?spot=nairobi-cbd-firestation)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const spotParam = params.get('spot');
      if (spotParam) {
        const found = locations.find((l) => l.id === spotParam);
        if (found) {
          setSelectedLocationForModal(found);
          showToast(`Opening shared 100 Bob spot: ${found.name}`);
        }
      }
    }
  }, [locations]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        showToast(`Connected to Google Drive as ${result.user.displayName || result.user.email}!`);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      showToast(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      showToast('Signed out of Google Drive.');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Auto-track active section while user scrolls (Scrollspy)
  useEffect(() => {
    const sectionIds = ['hero', 'menu', 'locations', 'plate-builder', 'values', 'careers', 'about'];
    
    const handleScrollObserver = () => {
      const scrollPosition = window.scrollY + 140; // offset for sticky header
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollObserver, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollObserver);
  }, []);

  // Navigation scroll helper with offset for sticky header
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // Save Meal to Bookmarks & Drive list
  const handleSaveMeal = (meal: MealItem) => {
    const existing = savedSpots.find((s) => s.spotId === meal.id);
    if (existing) {
      setSavedSpots(savedSpots.filter((s) => s.spotId !== meal.id));
      showToast(`Removed "${meal.name}" from your saved list.`);
    } else {
      const newSaved: DriveSavedSpot = {
        spotId: meal.id,
        spotName: meal.name,
        city: 'Kenya',
        neighborhood: meal.popularIn[0] || 'Across Kenya',
        meal: meal.name,
        price: meal.price,
        notes: meal.description,
        savedAt: new Date().toISOString().split('T')[0],
      };
      setSavedSpots([...savedSpots, newSaved]);
      showToast(`Added "${meal.name}" to your list! Click Google Drive to sync.`);
    }
  };

  // Save Location to Bookmarks & Drive list
  const handleSaveLocationToDrive = (loc: HotelLocation) => {
    const existing = savedSpots.find((s) => s.spotId === loc.id);
    if (existing) {
      setSavedSpots(savedSpots.filter((s) => s.spotId !== loc.id));
      showToast(`Removed "${loc.name}" from your saved list.`);
    } else {
      const newSaved: DriveSavedSpot = {
        spotId: loc.id,
        spotName: loc.name,
        city: loc.city,
        neighborhood: loc.neighborhood,
        meal: `${loc.signatureMeal} (${loc.signaturePrice} KSh)`,
        price: loc.signaturePrice,
        notes: `Landmark: ${loc.landmark}. Hours: ${loc.hours.monFri}`,
        savedAt: new Date().toISOString().split('T')[0],
      };
      setSavedSpots([...savedSpots, newSaved]);
      showToast(`Added "${loc.name}" to your saved spots!`);
    }
  };

  // Save custom plate combo to bookmarks
  const handleSaveComboToDrive = (comboName: string, items: any[], total: number) => {
    const comboId = `combo-${Date.now()}`;
    const newSaved: DriveSavedSpot = {
      spotId: comboId,
      spotName: comboName || 'Custom 100 Bob Plate',
      city: 'Custom Combo',
      neighborhood: 'DIY Plate',
      meal: items.map((i) => i.name).join(' + '),
      price: total,
      notes: `Custom meal combination under 100 KSh. Total: ${total} KSh.`,
      savedAt: new Date().toISOString().split('T')[0],
    };
    setSavedSpots([...savedSpots, newSaved]);
    setIsDriveModalOpen(true);
    showToast(`Plate combo saved! Ready to sync to Google Drive.`);
  };

  // Remove saved spot
  const handleRemoveSavedSpot = (spotId: string) => {
    setSavedSpots(savedSpots.filter((s) => s.spotId !== spotId));
    showToast('Spot removed from list.');
  };

  // Handle Order / Filter for meal
  const handleOrderMeal = (meal: MealItem) => {
    handleNavigate('locations');
    showToast(`Showing hotspots serving ${meal.name}`);
  };

  // Find Kibanda for combo
  const handleFindKibandaForCombo = (comboName: string) => {
    handleNavigate('locations');
    showToast(`Showing nearest joints for "${comboName}"`);
  };

  // Add Community Submitted Spot
  const handleSubmitNewSpot = (newSpot: Omit<HotelLocation, 'id'>) => {
    const id = `community-spot-${Date.now()}`;
    const createdLoc: HotelLocation = { ...newSpot, id };
    setLocations([createdLoc, ...locations]);

    // Also auto-add to bookmarks
    const newSaved: DriveSavedSpot = {
      spotId: id,
      spotName: createdLoc.name,
      city: createdLoc.city,
      neighborhood: createdLoc.neighborhood,
      meal: `${createdLoc.signatureMeal} (${createdLoc.signaturePrice} KSh)`,
      price: createdLoc.signaturePrice,
      notes: `Submitted by user. Landmark: ${createdLoc.landmark}`,
      savedAt: new Date().toISOString().split('T')[0],
    };
    setSavedSpots([newSaved, ...savedSpots]);
    showToast(`"${createdLoc.name}" added to directory and bookmarked for Drive!`);
  };

  // Add Review to an Eatery
  const handleAddReview = (newReview: Omit<EateryReview, 'id' | 'date'>) => {
    const createdReview: EateryReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews([createdReview, ...reviews]);
    showToast(`Asante! Your ${newReview.rating}★ review has been published.`);
  };

  const savedMealIds = savedSpots.map((s) => s.spotId);
  const savedLocationIds = savedSpots.map((s) => s.spotId);

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#0C1E17] flex flex-col font-sans selection:bg-[#00843D] selection:text-white pb-14 lg:pb-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C1416] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5BA13] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenSubmitSpotModal={() => setIsSubmitSpotModalOpen(true)}
        onOpenQuickLinksModal={() => setIsQuickLinksModalOpen(true)}
        onOpenBudgetTracker={() => setIsBudgetTrackerOpen(true)}
        totalBudgetSpent={totalBudgetSpent}
        dailyBudgetGoal={dailyBudgetGoal}
        onLogout={handleLogout}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        savedSpotsCount={savedSpots.length}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onViewMenu={() => handleNavigate('menu')}
          onViewLocations={() => handleNavigate('locations')}
          onOpenPlateBuilder={() => handleNavigate('plate-builder')}
        />

        {/* Quick Links Strip */}
        <QuickLinksBar
          onNavigate={handleNavigate}
          onOpenDriveModal={() => setIsDriveModalOpen(true)}
          onOpenSubmitSpotModal={() => setIsSubmitSpotModalOpen(true)}
          onOpenQuickLinksModal={() => setIsQuickLinksModalOpen(true)}
          onOpenBudgetTracker={() => setIsBudgetTrackerOpen(true)}
          totalBudgetSpent={totalBudgetSpent}
          dailyBudgetGoal={dailyBudgetGoal}
        />

        {/* 2. Signature 100 Bob Meals Showcase */}
        <SignatureMeals
          onOrderMeal={handleOrderMeal}
          onSaveSpot={handleSaveMeal}
          savedMealIds={savedMealIds}
        />

        {/* 3. Locations Directory & Interactive Map */}
        <LocationsSection
          locations={locations}
          onSelectLocation={(loc) => setSelectedLocationForModal(loc)}
          onSaveLocationToDrive={handleSaveLocationToDrive}
          savedLocationIds={savedLocationIds}
          reviews={reviews}
        />

        {/* 4. Interactive Plate Builder ("Kula Na 100 Bob") */}
        <PlateBuilder
          onSaveComboToDrive={handleSaveComboToDrive}
          onFindKibandaForCombo={handleFindKibandaForCombo}
        />

        {/* 5. Core Values & Transparency Progress */}
        <ValuesSection />

        {/* 6. Careers Section */}
        <CareersSection />

        {/* 7. About Section */}
        <AboutSection />
      </main>

      {/* Footer with Quick Links */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenSubmitSpotModal={() => setIsSubmitSpotModalOpen(true)}
        onOpenQuickLinksModal={() => setIsQuickLinksModalOpen(true)}
      />

      {/* Google Drive Integration Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        user={user}
        accessToken={accessToken}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleLogout}
        isSigningIn={isSigningIn}
        savedSpots={savedSpots}
        onRemoveSavedSpot={handleRemoveSavedSpot}
      />

      {/* Submit Community Spot Modal */}
      <SubmitSpotModal
        isOpen={isSubmitSpotModalOpen}
        onClose={() => setIsSubmitSpotModalOpen(false)}
        onSubmitSpot={handleSubmitNewSpot}
        hasGoogleDrive={Boolean(user && accessToken)}
      />

      {/* Location Detail & Directions Modal with Review System */}
      <LocationDetailModal
        location={selectedLocationForModal}
        onClose={() => setSelectedLocationForModal(null)}
        onSaveToDrive={handleSaveLocationToDrive}
        isSaved={selectedLocationForModal ? savedLocationIds.includes(selectedLocationForModal.id) : false}
        currentUser={user}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* Quick Links Command Hub Modal */}
      <QuickLinksModal
        isOpen={isQuickLinksModalOpen}
        onClose={() => setIsQuickLinksModalOpen(false)}
        onNavigate={handleNavigate}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenSubmitSpotModal={() => setIsSubmitSpotModalOpen(true)}
        onOpenBudgetTracker={() => setIsBudgetTrackerOpen(true)}
      />

      {/* Floating Daily Budget Capsule Indicator */}
      <FloatingBudgetWidget
        expenses={dailyExpenses}
        dailyGoal={dailyBudgetGoal}
        onOpenTracker={() => setIsBudgetTrackerOpen(true)}
      />

      {/* Daily Budget Tracker Sidebar Dashboard with Recharts Trends */}
      <DailyBudgetTracker
        isOpen={isBudgetTrackerOpen}
        onClose={() => setIsBudgetTrackerOpen(false)}
        expenses={dailyExpenses}
        onAddExpense={handleAddBudgetExpense}
        onRemoveExpense={handleRemoveBudgetExpense}
        onResetToday={handleResetTodayBudget}
        dailyGoal={dailyBudgetGoal}
        onUpdateDailyGoal={setDailyBudgetGoal}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
      />
    </div>
  );
}
