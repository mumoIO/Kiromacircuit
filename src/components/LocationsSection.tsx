/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Search,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Navigation,
  Utensils,
  DollarSign,
  Flame,
  Star,
  LocateFixed,
  Loader2,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { HOTEL_LOCATIONS } from '../data/mealsAndLocations';
import { HotelLocation, EateryReview } from '../types';

// Haversine distance formula in kilometers
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface LocationsSectionProps {
  locations?: HotelLocation[];
  onSelectLocation: (loc: HotelLocation) => void;
  onSaveLocationToDrive: (loc: HotelLocation) => void;
  savedLocationIds: string[];
  reviews?: EateryReview[];
}

export default function LocationsSection({
  locations = HOTEL_LOCATIONS,
  onSelectLocation,
  onSaveLocationToDrive,
  savedLocationIds,
  reviews = [],
}: LocationsSectionProps) {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [onlyTrending, setOnlyTrending] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Proximity & Geolocation state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sortByProximity, setSortByProximity] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  const cities = ['All', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];

  const priceRanges = [
    { id: 'all', label: 'All Prices (<= 100 KSh)', sub: 'All Meals' },
    { id: '20-50', label: '20 – 50 KSh', sub: 'Chai & Light Bites' },
    { id: '51-80', label: '51 – 80 KSh', sub: 'Smocha & Madondo' },
    { id: '81-100', label: '81 – 100 KSh', sub: 'Heavy Plates & Omena' },
  ];

  // Helper to determine if a location is trending or most popular
  const getLocationStats = (locId: string) => {
    const locReviews = reviews.filter((r) => r.locationId === locId);
    const isSaved = savedLocationIds.includes(locId);
    const avgRating =
      locReviews.length > 0
        ? locReviews.reduce((sum, r) => sum + r.rating, 0) / locReviews.length
        : 4.8;
    
    // Trending: saved by user, has 2+ reviews, or top viral spots
    const isTrending =
      isSaved ||
      locReviews.length >= 2 ||
      ['nairobi-cbd-firestation', 'ngara-figtree', 'mombasa-kibokoni'].includes(locId);

    // Most popular: high rating and positive reviews
    const isPopular =
      avgRating >= 4.8 ||
      ['westlands-mpaka', 'kisumu-oile-park'].includes(locId);

    return {
      reviewsCount: locReviews.length,
      averageRating: avgRating.toFixed(1),
      isTrending,
      isPopular,
    };
  };

  const filteredLocations = locations.filter((loc) => {
    const matchesCity = selectedCity === 'All' || loc.city === selectedCity;

    let matchesPrice = true;
    if (selectedPriceRange === '20-50') {
      matchesPrice = loc.signaturePrice >= 20 && loc.signaturePrice <= 50;
    } else if (selectedPriceRange === '51-80') {
      matchesPrice = loc.signaturePrice >= 51 && loc.signaturePrice <= 80;
    } else if (selectedPriceRange === '81-100') {
      matchesPrice = loc.signaturePrice >= 81 && loc.signaturePrice <= 100;
    }

    const stats = getLocationStats(loc.id);
    if (onlyTrending && !stats.isTrending && !stats.isPopular) {
      return false;
    }

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      loc.name.toLowerCase().includes(query) ||
      loc.neighborhood.toLowerCase().includes(query) ||
      loc.address.toLowerCase().includes(query) ||
      loc.landmark.toLowerCase().includes(query) ||
      loc.signatureMeal.toLowerCase().includes(query);

    return matchesCity && matchesPrice && matchesSearch;
  });

  const handleToggleProximity = () => {
    if (sortByProximity) {
      setSortByProximity(false);
      return;
    }

    if (userCoords) {
      setSortByProximity(true);
      return;
    }

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSortByProximity(true);
        setIsLocating(false);
        setLocationSuccessMsg('Found your location! Reordered 100 Bob eateries closest-to-farthest.');
        setTimeout(() => setLocationSuccessMsg(null), 4000);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission was denied in your browser. Tap "Simulate Nairobi CBD" to test proximity!');
        } else if (error.code === error.TIMEOUT) {
          setLocationError('Location request timed out. Please try again or test with simulated spot.');
        } else {
          setLocationError('Could not determine exact location. Try again or test with simulated spot.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSimulateLocation = (lat: number, lng: number, name: string) => {
    setUserCoords({ lat, lng });
    setSortByProximity(true);
    setLocationError(null);
    setLocationSuccessMsg(`Coordinates set to ${name}! Closest 100 Bob spots reordered.`);
    setTimeout(() => setLocationSuccessMsg(null), 4000);
  };

  // Reorder and compute distance in kilometers
  const filteredAndSortedLocations = useMemo(() => {
    const listWithDistance = filteredLocations.map((loc) => {
      const distance = userCoords
        ? calculateDistanceKm(userCoords.lat, userCoords.lng, loc.lat, loc.lng)
        : null;
      return {
        ...loc,
        distance,
      };
    });

    if (sortByProximity && userCoords) {
      return [...listWithDistance].sort((a, b) => (a.distance ?? 999999) - (b.distance ?? 999999));
    }

    return listWithDistance;
  }, [filteredLocations, sortByProximity, userCoords]);

  const handleShare = (loc: HotelLocation) => {
    navigator.clipboard?.writeText(
      `Check out ${loc.name} for 100 Bob Meals: ${loc.address} (${loc.landmark}). Signature: ${loc.signatureMeal} for ${loc.signaturePrice} KSh!`
    );
    setCopiedId(loc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="locations" className="py-20 bg-[#F8F9F5] text-[#0C1E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#00843D]" />
            <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-emerald-800">
              OUR LOCATIONS
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0C1E17]">
            Find A <span className="text-[#00843D]">100KSh Meal</span> Near You.
          </h2>

          <p className="mt-3 text-lg text-gray-600 font-medium">
            100-Meal Kenya — Verified spots, vibandas, and canteens serving piping-hot food under 100 Bob.
          </p>

          {/* Search bar & City filter tabs */}
          <div className="mt-8 space-y-4">
            {/* Search Input */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by neighborhood, street, or meal (e.g. Tom Mboya, Smocha, Ngara)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* City Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {cities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
                      isSelected
                        ? 'bg-[#00843D] text-white shadow-emerald-950/20'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {city} {city === 'All' ? `(${locations.length})` : ''}
                  </button>
                );
              })}
            </div>

            {/* Price Range Filter (20-50, 50-80, 80-100 KSh) */}
            <div className="pt-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5">
                <DollarSign className="w-3.5 h-3.5 text-[#00843D]" />
                <span>Filter by Price Range:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {priceRanges.map((range) => {
                  const isSelected = selectedPriceRange === range.id;
                  return (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPriceRange(range.id)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 shadow-sm ${
                        isSelected
                          ? 'bg-[#00843D] text-white shadow-emerald-950/20 shadow-md ring-2 ring-[#00843D]/40'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span>{range.label}</span>
                    </button>
                  );
                })}

                {/* Trending Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setOnlyTrending(!onlyTrending)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 shadow-sm border ${
                    onlyTrending
                      ? 'bg-[#00843D] text-white border-[#00843D] ring-2 ring-[#00843D]/40 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${onlyTrending ? 'fill-[#F5BA13] text-[#F5BA13]' : 'fill-orange-500 text-orange-500'}`} />
                  <span>🔥 Trending Only</span>
                </button>

                {/* Sort by Proximity Button */}
                <button
                  type="button"
                  onClick={handleToggleProximity}
                  disabled={isLocating}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 shadow-sm border ${
                    sortByProximity
                      ? 'bg-[#00843D] text-white border-[#00843D] ring-2 ring-[#00843D]/40 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:text-[#00843D]'
                  }`}
                  title="Reorder 100 Bob spots based on your live GPS distance"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00843D]" />
                  ) : (
                    <LocateFixed className={`w-4 h-4 ${sortByProximity ? 'text-[#F5BA13]' : 'text-[#00843D]'}`} />
                  )}
                  <span>
                    {isLocating
                      ? 'Locating...'
                      : sortByProximity
                      ? '📍 Nearest to Me (Active)'
                      : '📍 Sort by Proximity'}
                  </span>
                </button>
              </div>
            </div>

            {/* Geolocation Success Message Banner */}
            {locationSuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-bold flex items-center justify-between max-w-xl mx-auto shadow-sm animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                  <span>{locationSuccessMsg}</span>
                </div>
                <button
                  onClick={() => setLocationSuccessMsg(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Geolocation Error & Simulation Fallback Banner */}
            {locationError && (
              <div className="p-4 bg-amber-50 text-amber-900 border border-amber-300 rounded-2xl text-xs font-medium max-w-xl mx-auto shadow-sm animate-fade-in space-y-2 text-left">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{locationError}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] font-bold text-gray-600">Simulate Location:</span>
                  <button
                    type="button"
                    onClick={() => handleSimulateLocation(-1.286389, 36.817223, 'Nairobi CBD')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 border border-amber-300 text-xs font-bold transition-all shadow-xs"
                  >
                    Nairobi CBD
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateLocation(-1.2635, 36.8028, 'Westlands')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 border border-amber-300 text-xs font-bold transition-all shadow-xs"
                  >
                    Westlands
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateLocation(-4.0435, 39.6682, 'Mombasa Coast')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-900 border border-amber-300 text-xs font-bold transition-all shadow-xs"
                  >
                    Mombasa Coast
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationError(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold ml-auto"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Active Filters Bar */}
            {(selectedCity !== 'All' || selectedPriceRange !== 'all' || onlyTrending || sortByProximity || searchQuery) && (
              <div className="pt-2 flex items-center justify-center gap-3 text-xs flex-wrap">
                <span className="text-gray-500 font-medium">
                  Showing <strong>{filteredAndSortedLocations.length}</strong> spots
                  {selectedCity !== 'All' && ` in ${selectedCity}`}
                  {selectedPriceRange !== 'all' && ` (${priceRanges.find(r => r.id === selectedPriceRange)?.label})`}
                  {onlyTrending && ' • Trending & Top Saved'}
                  {sortByProximity && ' • Nearest to your location'}
                </span>
                <button
                  onClick={() => {
                    setSelectedCity('All');
                    setSelectedPriceRange('all');
                    setOnlyTrending(false);
                    setSortByProximity(false);
                    setSearchQuery('');
                  }}
                  className="text-[#00843D] font-bold hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location Cards */}
        {filteredAndSortedLocations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto shadow-sm">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No spots found</h3>
            <p className="text-sm text-gray-500 mt-1">Try resetting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAndSortedLocations.map((loc, idx) => {
              const isOpen = loc.status === 'OPEN NOW';
              const isSaved = savedLocationIds.includes(loc.id);
              const stats = getLocationStats(loc.id);

              return (
                <div
                  key={loc.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200/90 flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-xl hover:border-emerald-200"
                >
                  {/* Top Status & Name */}
                  <div>
                    {/* Status & Popularity & Proximity Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Status Pill */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                          }`}
                        />
                        <span>{loc.status}</span>
                      </div>

                      {/* Distance / Proximity Badge */}
                      {loc.distance !== null && (
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border shadow-sm ${
                            sortByProximity && idx === 0
                              ? 'bg-[#00843D] text-white border-emerald-400 ring-2 ring-emerald-300'
                              : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          <LocateFixed className="w-3.5 h-3.5 text-[#F5BA13]" />
                          <span>
                            {loc.distance < 1
                              ? `${Math.round(loc.distance * 1000)}m away`
                              : `${loc.distance.toFixed(1)} km away`}
                          </span>
                          {sortByProximity && idx === 0 && (
                            <span className="text-[9px] bg-white text-[#00843D] px-1.5 py-0.2 rounded-full font-extrabold ml-0.5">
                              Closest
                            </span>
                          )}
                        </div>
                      )}

                      {/* Trending Badge */}
                      {stats.isTrending && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-100 text-[#00843D] border border-emerald-300 shadow-sm animate-pulse">
                          <Flame className="w-3.5 h-3.5 fill-[#00843D] text-[#00843D]" />
                          <span>Trending Spot</span>
                        </div>
                      )}

                      {/* Most Popular Badge */}
                      {stats.isPopular && !stats.isTrending && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-50 text-amber-900 border border-amber-300 shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-[#F5BA13] text-[#F5BA13]" />
                          <span>Most Popular</span>
                        </div>
                      )}

                      {/* Community Score */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
                        <Star className="w-3 h-3 fill-[#F5BA13] text-[#F5BA13]" />
                        <span>{stats.averageRating}</span>
                        {stats.reviewsCount > 0 && (
                          <span className="text-gray-400 font-medium">({stats.reviewsCount})</span>
                        )}
                      </div>
                    </div>

                    {/* Location Name in bold uppercase underline */}
                    <div className="border-b-2 border-emerald-950/20 pb-3 mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0C1E17] uppercase">
                          {loc.name}
                        </h3>
                        <div className="text-xs font-bold text-[#00843D] tracking-wide mt-1">
                          {loc.neighborhood}, {loc.city}
                        </div>
                      </div>

                      {/* Save to Drive & Share Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSaveLocationToDrive(loc)}
                          title={isSaved ? 'Saved in Google Drive' : 'Save spot to Google Drive'}
                          className={`p-2.5 rounded-full transition-all active:scale-90 ${
                            isSaved
                              ? 'bg-[#00843D] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-[#00843D]'
                          }`}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleShare(loc)}
                          title="Copy details to clipboard"
                          className="p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-90"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Copied indicator toast */}
                    {copiedId === loc.id && (
                      <div className="mb-4 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg text-center animate-fade-in border border-emerald-200">
                        ✓ Spot details copied to clipboard!
                      </div>
                    )}

                    {/* Address block */}
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-[#00843D] mb-1">
                          ADDRESS
                        </div>
                        <p className="font-semibold text-gray-800">{loc.address}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#00843D] flex-shrink-0" />
                          <span>Landmark: {loc.landmark}</span>
                        </p>
                      </div>

                      {/* Hours block */}
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-[#00843D] mb-1">
                          HOURS
                        </div>
                        <div className="font-medium text-gray-700 space-y-0.5 text-xs sm:text-sm">
                          <div>Mon–Fri: {loc.hours.monFri}</div>
                          <div>Sat: {loc.hours.sat}</div>
                          <div>Sun: {loc.hours.sun}</div>
                        </div>
                      </div>

                      {/* Contact & M-Pesa */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <div className="text-xs font-black uppercase tracking-wider text-gray-500 mb-0.5">
                            PHONE / CALL
                          </div>
                          <a
                            href={`tel:${loc.phone}`}
                            className="text-xs sm:text-sm font-bold text-gray-800 hover:text-[#00843D] flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#00843D]" />
                            <span>{loc.phone}</span>
                          </a>
                        </div>

                        {loc.mpesaTill && (
                          <div>
                            <div className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-0.5">
                              M-PESA BUY GOODS TILL
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {loc.mpesaTill}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Signature 100 Bob Meal */}
                      <div className="bg-[#F8F9F5] p-3.5 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                            ⭐ Top 100 Bob Specialty
                          </div>
                          <div className="font-bold text-sm text-[#0C1E17]">
                            {loc.signatureMeal}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-[#00843D]">
                            {loc.signaturePrice} KSh
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Map Visualizer */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/8] bg-slate-100 border border-gray-200 mb-4 group">
                      <div className="absolute inset-0 bg-[#E5E9EC] flex items-center justify-center">
                        <svg className="w-full h-full opacity-40" viewBox="0 0 400 200">
                          <rect width="400" height="200" fill="#E8ECEF" />
                          <path d="M0 60 Q 150 40 400 80" stroke="#FFFFFF" strokeWidth="14" fill="none" />
                          <path d="M0 140 Q 250 160 400 120" stroke="#FFFFFF" strokeWidth="12" fill="none" />
                          <path d="M120 0 Q 140 100 160 200" stroke="#FFFFFF" strokeWidth="14" fill="none" />
                          <path d="M280 0 Q 260 100 290 200" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                          <rect x="180" y="70" width="80" height="50" rx="8" fill="#D2E8D4" />
                          <circle cx="360" cy="170" r="40" fill="#C5DCF0" />
                        </svg>

                        {/* Green Pin for location */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-[#00843D] text-white flex items-center justify-center shadow-xl animate-bounce border-2 border-white">
                            <MapPin className="w-6 h-6 fill-white" />
                          </div>
                          <span className="text-[11px] font-black bg-white px-2 py-0.5 rounded shadow text-gray-800 mt-1 border border-gray-100">
                            {loc.name.split('—')[0]}
                          </span>
                        </div>
                      </div>

                      {/* "Open in Maps" Button on top-left */}
                      <a
                        href={loc.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 left-3 z-20 bg-white/95 hover:bg-white text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md border border-gray-200 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <span>Open in Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => onSelectLocation(loc)}
                        className="w-full py-3.5 px-6 rounded-full bg-[#00843D] hover:bg-[#006e33] text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                      >
                        <span>View Kibanda Details & Order</span>
                        <span>→</span>
                      </button>

                      <a
                        href={loc.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto py-3.5 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#00843D]" />
                        <span>Get Directions</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
