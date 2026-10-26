/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Clock,
  Star,
  Sparkles,
  MapPin,
  Heart,
  Activity,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Leaf,
  Utensils,
} from 'lucide-react';
import { SIGNATURE_MEALS } from '../data/mealsAndLocations';
import { MealItem } from '../types';

interface SignatureMealsProps {
  onOrderMeal: (meal: MealItem) => void;
  onSaveSpot: (meal: MealItem) => void;
  savedMealIds: string[];
}

export default function SignatureMeals({ onOrderMeal, onSaveSpot, savedMealIds }: SignatureMealsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedNutritionId, setExpandedNutritionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'deck'>('grid');
  const [activeDeckIndex, setActiveDeckIndex] = useState<number>(0);

  const categories = [
    { id: 'all', label: 'All 6 Meals' },
    { id: 'healthy', label: '🥗 Healthy Choices Only', badge: 'High Nutrition' },
    { id: 'chapo', label: 'Chapo Specials' },
    { id: 'smocha', label: 'Smocha & Street' },
    { id: 'ugali', label: 'Ugali & Greens' },
    { id: 'traditional', label: 'Githeri & Kienyeji' },
    { id: 'breakfast', label: 'Chips & Fast Bites' },
  ];

  const filteredMeals = SIGNATURE_MEALS.filter((m) => {
    if (selectedCategory === 'healthy') {
      return m.nutrition?.isHealthyChoice === true;
    }
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  const toggleNutrition = (id: string) => {
    setExpandedNutritionId(expandedNutritionId === id ? null : id);
  };

  return (
    <section id="menu" className="py-24 bg-[#F8F9F5] text-[#0C1E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#00843D]" />
            <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-emerald-800">
              THE MENU
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0C1E17]">
            Six Meals.{' '}
            <span className="text-[#00843D]">No Filler.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            We kept the menu small on purpose — it&apos;s how we keep everything fresh, fast, and strictly priced under 100 KSh.
            Explore estimated macros and healthy 100 Bob power meals.
          </p>

          {/* Filter Pills with Healthy Option highlighted */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const isHealthyTab = cat.id === 'healthy';
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveDeckIndex(0);
                  }}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    isSelected
                      ? isHealthyTab
                        ? 'bg-emerald-700 text-white shadow-emerald-950/20'
                        : 'bg-[#00843D] text-white shadow-emerald-950/20'
                      : isHealthyTab
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* View mode toggle: Grid vs Stacked Cards Deck */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Layout:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#00843D] text-white shadow-sm'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('deck')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'deck'
                  ? 'bg-[#00843D] text-white shadow-sm'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Card Deck Stack
            </button>
          </div>
        </div>

        {/* 1. DECK STACK VIEW */}
        {viewMode === 'deck' && filteredMeals.length > 0 && (
          <div className="max-w-xl mx-auto mb-16">
            {/* Card selector tabs */}
            <div className="flex items-center justify-center gap-1.5 mb-6 overflow-x-auto pb-2">
              {filteredMeals.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setActiveDeckIndex(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    activeDeckIndex === idx
                      ? 'bg-[#00843D] text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {m.name.split(' ')[0]} ({m.price}/=)
                </button>
              ))}
            </div>

            {/* The Arched Stacked Card */}
            {(() => {
              const meal = filteredMeals[activeDeckIndex] || filteredMeals[0];
              const isGreen = meal.cardColor === 'green' || meal.cardColor === 'red';
              const isSaved = savedMealIds.includes(meal.id);
              const nutrition = meal.nutrition;

              return (
                <div className="relative pt-6">
                  {/* Background layered tab peeking from behind */}
                  <div
                    className={`absolute inset-x-6 top-0 h-16 rounded-t-[48px] opacity-75 transform -translate-y-2 ${
                      isGreen ? 'bg-[#F5BA13]' : 'bg-[#00843D]'
                    }`}
                  />

                  {/* Main Arched Card */}
                  <div
                    className={`relative rounded-t-[48px] rounded-b-[36px] overflow-hidden shadow-2xl transition-all ${
                      isGreen ? 'bg-[#00843D] text-white' : 'bg-[#F5BA13] text-[#0C1E17]'
                    }`}
                  >
                    <div className="p-8 sm:p-10">
                      {/* Price & Healthy Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`text-4xl sm:text-5xl font-black tracking-tight ${
                            isGreen ? 'text-[#F5BA13]' : 'text-[#00843D]'
                          }`}
                        >
                          {meal.price} KSh
                        </div>

                        <div className="flex items-center gap-2">
                          {nutrition?.isHealthyChoice && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white text-emerald-800 shadow-sm">
                              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Healthy Choice</span>
                            </span>
                          )}

                          <button
                            onClick={() => onSaveSpot(meal)}
                            className={`p-2.5 rounded-full transition-all active:scale-90 ${
                              isGreen
                                ? isSaved
                                  ? 'bg-white text-[#00843D]'
                                  : 'bg-black/20 text-white hover:bg-black/30'
                                : isSaved
                                ? 'bg-[#0C1E17] text-[#F5BA13]'
                                : 'bg-black/10 text-[#0C1E17] hover:bg-black/20'
                            }`}
                          >
                            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl sm:text-4xl font-black leading-tight mb-2 tracking-tight">
                        {meal.name}
                      </h3>

                      {/* Description */}
                      <p
                        className={`text-base leading-relaxed font-medium mb-6 ${
                          isGreen ? 'text-white/90' : 'text-[#0C1E17]/90'
                        }`}
                      >
                        {meal.description}
                      </p>

                      {/* Order Button */}
                      <button
                        onClick={() => onOrderMeal(meal)}
                        className={`w-full py-4 px-8 rounded-full font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98 ${
                          isGreen
                            ? 'bg-[#F5BA13] hover:bg-[#e0a80d] text-[#0C1E17]'
                            : 'bg-[#00843D] hover:bg-[#006e33] text-white'
                        }`}
                      >
                        <span>Find Hotspots Serving This</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Food Photo Container */}
                    <div className="relative aspect-[16/9] bg-black/10 overflow-hidden">
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Nutritional Breakdown Area */}
                    {nutrition && (
                      <div className="bg-white text-[#0C1E17] p-6 sm:p-7 border-t border-black/5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
                              Estimated Nutritional Breakdown
                            </h4>
                          </div>
                          <span className="text-xs font-black bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            {nutrition.calories} kcal
                          </span>
                        </div>

                        {/* Macros Grid */}
                        <div className="grid grid-cols-4 gap-2 text-center mb-4">
                          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                            <div className="text-sm font-black text-emerald-700">{nutrition.protein}g</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase">Protein</div>
                          </div>
                          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                            <div className="text-sm font-black text-blue-700">{nutrition.fiber}g</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase">Fiber</div>
                          </div>
                          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                            <div className="text-sm font-black text-amber-700">{nutrition.carbs}g</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase">Carbs</div>
                          </div>
                          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                            <div className="text-sm font-black text-gray-700">{nutrition.fat}g</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase">Fat</div>
                          </div>
                        </div>

                        {/* Health Tags */}
                        {nutrition.healthTags && (
                          <div className="flex flex-wrap gap-1.5">
                            {nutrition.healthTags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200"
                              >
                                ✓ {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 2. GRID VIEW (All signature meals side by side) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMeals.map((meal) => {
              const isGreen = meal.cardColor === 'green' || meal.cardColor === 'red';
              const isSaved = savedMealIds.includes(meal.id);
              const nutrition = meal.nutrition;
              const isExpanded = expandedNutritionId === meal.id;

              return (
                <div
                  key={meal.id}
                  className="group relative flex flex-col rounded-t-[44px] rounded-b-[32px] overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 border border-black/5"
                >
                  {/* Upper Color Card */}
                  <div
                    className={`p-7 relative transition-colors ${
                      isGreen ? 'bg-[#00843D] text-white' : 'bg-[#F5BA13] text-[#0C1E17]'
                    }`}
                  >
                    {/* Header Row: Price, Healthy Badge & Bookmark */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`text-3xl sm:text-4xl font-black tracking-tight ${
                          isGreen ? 'text-[#F5BA13]' : 'text-[#00843D]'
                        }`}
                      >
                        {meal.price} KSh
                      </div>

                      <div className="flex items-center gap-2">
                        {nutrition?.isHealthyChoice && (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              isGreen
                                ? 'bg-white text-emerald-800 shadow-sm'
                                : 'bg-[#0C1E17] text-[#F5BA13]'
                            }`}
                          >
                            <Leaf className="w-3 h-3 text-emerald-600" />
                            <span>Healthy</span>
                          </span>
                        )}

                        <button
                          onClick={() => onSaveSpot(meal)}
                          title={isSaved ? 'Saved in Google Drive' : 'Save to Google Drive'}
                          className={`p-2 rounded-full transition-all active:scale-90 ${
                            isGreen
                              ? isSaved
                                ? 'bg-white text-[#00843D]'
                                : 'bg-black/20 text-white hover:bg-black/30'
                              : isSaved
                              ? 'bg-[#0C1E17] text-[#F5BA13]'
                              : 'bg-black/10 text-[#0C1E17] hover:bg-black/20'
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Meal Title */}
                    <h3 className="text-2xl font-black leading-tight mb-2 tracking-tight">
                      {meal.name}
                    </h3>

                    {/* Sheng Name */}
                    {meal.shengName && (
                      <div
                        className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                          isGreen ? 'text-emerald-100' : 'text-emerald-950/80'
                        }`}
                      >
                        &quot;{meal.shengName}&quot;
                      </div>
                    )}

                    {/* Description */}
                    <p
                      className={`text-sm leading-relaxed font-medium mb-6 min-h-[4rem] ${
                        isGreen ? 'text-white/90' : 'text-[#0C1E17]/90'
                      }`}
                    >
                      {meal.description}
                    </p>

                    {/* Action Button */}
                    <button
                      onClick={() => onOrderMeal(meal)}
                      className={`w-full py-3.5 px-6 rounded-full font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 ${
                        isGreen
                          ? 'bg-[#F5BA13] hover:bg-[#e0a80d] text-[#0C1E17]'
                          : 'bg-[#00843D] hover:bg-[#006e33] text-white'
                      }`}
                    >
                      <span>Find Hotspots Serving This</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lower Card Section: Image and Details */}
                  <div className="bg-white p-6 flex-1 flex flex-col justify-between">
                    {/* Image */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-4 bg-gray-100">
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#F5BA13]" />
                        <span>{meal.prepTime}</span>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#F5BA13] text-[#F5BA13]" />
                        <span>{meal.rating}</span>
                        <span className="text-gray-400">({meal.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {meal.highlights.slice(0, 3).map((h, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60 px-2 py-0.5 rounded-md"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* NUTRITIONAL BREAKDOWN ACCORDION */}
                    {nutrition && (
                      <div className="border-t border-gray-100 pt-3">
                        <button
                          type="button"
                          onClick={() => toggleNutrition(meal.id)}
                          className="w-full flex items-center justify-between text-xs font-black text-gray-700 hover:text-[#00843D] py-1 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Nutrition & Macros ({nutrition.calories} kcal)</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#00843D]" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-emerald-200/60 text-xs space-y-3 animate-fade-in">
                            {/* Macro breakdown pills */}
                            <div className="grid grid-cols-4 gap-1.5 text-center">
                              <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                                <div className="font-extrabold text-emerald-700">{nutrition.protein}g</div>
                                <div className="text-[9px] font-semibold text-gray-400 uppercase">Protein</div>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                                <div className="font-extrabold text-blue-700">{nutrition.fiber}g</div>
                                <div className="text-[9px] font-semibold text-gray-400 uppercase">Fiber</div>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                                <div className="font-extrabold text-amber-700">{nutrition.carbs}g</div>
                                <div className="text-[9px] font-semibold text-gray-400 uppercase">Carbs</div>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                                <div className="font-extrabold text-gray-700">{nutrition.fat}g</div>
                                <div className="text-[9px] font-semibold text-gray-400 uppercase">Fat</div>
                              </div>
                            </div>

                            {/* Tags */}
                            {nutrition.healthTags && (
                              <div className="flex flex-wrap gap-1">
                                {nutrition.healthTags.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200"
                                  >
                                    🌱 {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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
