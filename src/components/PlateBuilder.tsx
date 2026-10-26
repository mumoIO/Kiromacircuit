/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Utensils,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Sparkles,
  Cloud,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

interface PlateItem {
  id: string;
  name: string;
  category: 'carb' | 'stew' | 'greens' | 'extras';
  price: number;
  calories: string;
  icon: string;
}

const PLATE_ITEMS: PlateItem[] = [
  // Carbs
  { id: 'chapo-2', name: '2x Layered Chapatis', category: 'carb', price: 40, calories: '320 kcal', icon: '🥞' },
  { id: 'ugali', name: 'Ugali Mlima (White Corn)', category: 'carb', price: 25, calories: '290 kcal', icon: '🍚' },
  { id: 'rice', name: 'Spiced White Rice (Wali)', category: 'carb', price: 40, calories: '280 kcal', icon: '🌾' },
  { id: 'mukimo', name: 'Mukimo wa Kienyeji', category: 'carb', price: 50, calories: '340 kcal', icon: '🥔' },

  // Stews & Proteins
  { id: 'madondo', name: 'Yellow Beans Stew (Madondo)', category: 'stew', price: 35, calories: '210 kcal', icon: '🫘' },
  { id: 'ndengu', name: 'Green Grams Stew (Ndengu)', category: 'stew', price: 35, calories: '190 kcal', icon: '🟢' },
  { id: 'beef-gravy', name: 'Rich Beef Bone Broth Gravy', category: 'stew', price: 25, calories: '140 kcal', icon: '🥣' },
  { id: 'matumbo', name: 'Matumbo Tripe Gravy', category: 'stew', price: 50, calories: '260 kcal', icon: '🥘' },
  { id: 'omena', name: 'Lake Omena Sauté', category: 'stew', price: 45, calories: '230 kcal', icon: '🐟' },
  { id: 'egg-fried', name: 'Spanish Omelette / Fried Egg', category: 'stew', price: 25, calories: '120 kcal', icon: '🍳' },
  { id: 'egg-boiled', name: 'Boiled Egg (Mayai Pasua)', category: 'stew', price: 20, calories: '80 kcal', icon: '🥚' },

  // Greens & Veggies
  { id: 'sukuma', name: 'Sautéed Sukuma Wiki', category: 'greens', price: 20, calories: '70 kcal', icon: '🥬' },
  { id: 'cabbage', name: 'Steamed Sweet Cabbage', category: 'greens', price: 20, calories: '65 kcal', icon: '🥗' },
  { id: 'managu', name: 'Managu / Nightshade Greens', category: 'greens', price: 30, calories: '85 kcal', icon: '🌿' },
  { id: 'kachumbari', name: 'Fresh Diced Kachumbari', category: 'greens', price: 10, calories: '35 kcal', icon: '🍅' },

  // Extras
  { id: 'avocado', name: 'Creamy Hass Avocado Slice', category: 'extras', price: 15, calories: '110 kcal', icon: '🥑' },
  { id: 'sababisha', name: 'Sababisha (Free Broth Splash)', category: 'extras', price: 10, calories: '40 kcal', icon: '🍲' },
  { id: 'pilipili', name: 'Pili Pili Mbuzi Hot Relish', category: 'extras', price: 5, calories: '10 kcal', icon: '🌶️' },
  { id: 'tea', name: 'Chai ya Tangawizi (Ginger Tea)', category: 'extras', price: 20, calories: '90 kcal', icon: '☕' },
];

interface PlateBuilderProps {
  onSaveComboToDrive: (comboName: string, items: PlateItem[], total: number) => void;
  onFindKibandaForCombo: (comboName: string) => void;
}

export default function PlateBuilder({ onSaveComboToDrive, onFindKibandaForCombo }: PlateBuilderProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(['chapo-2', 'madondo', 'kachumbari']);
  const [customComboName, setCustomComboName] = useState('My Classic 100 Bob Plate');

  const selectedItems = PLATE_ITEMS.filter((item) => selectedItemIds.includes(item.id));
  const totalCost = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
  const remainingBudget = 100 - totalCost;
  const isBudgetExceeded = totalCost > 100;

  const toggleItem = (itemId: string) => {
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
    } else {
      setSelectedItemIds([...selectedItemIds, itemId]);
    }
  };

  const handleReset = () => {
    setSelectedItemIds(['chapo-2', 'madondo', 'kachumbari']);
  };

  const renderCategory = (category: PlateItem['category'], title: string) => {
    const items = PLATE_ITEMS.filter((i) => i.category === category);
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map((item) => {
            const isChecked = selectedItemIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isChecked
                    ? 'bg-[#00843D] text-white border-emerald-400/60 shadow-md shadow-emerald-950/40'
                    : 'bg-white/5 hover:bg-white/10 text-gray-200 border-emerald-500/15'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-sm font-bold leading-tight">{item.name}</div>
                    <div className={`text-[11px] ${isChecked ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {item.calories}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-black ${isChecked ? 'text-[#F5BA13]' : 'text-white'}`}>
                    +{item.price}/=
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      isChecked ? 'bg-white text-[#00843D]' : 'border border-white/20'
                    }`}
                  >
                    {isChecked ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section id="plate-builder" className="py-20 bg-[#081C15] text-white relative overflow-hidden">
      {/* Decorative blurred backdrops */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00843D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F5BA13]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 mb-3">
            <Sparkles className="w-4 h-4 text-[#F5BA13]" />
            <span className="text-xs font-black tracking-widest uppercase text-emerald-200">
              KULA NA SOO MOJA
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Build Your Own <span className="text-[#00843D] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-[#F5BA13]">100 Bob Plate</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-emerald-100/80 font-medium">
            Customize your carbs, stews, greens, and extras. Watch your live budget gauge and save your custom plate to Google Drive!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selector Categories */}
          <div className="lg:col-span-7 bg-[#0F291E] p-6 sm:p-8 rounded-3xl border border-emerald-500/20 space-y-6 shadow-xl">
            {renderCategory('carb', '1. Pick Your Foundation Carb')}
            {renderCategory('stew', '2. Pick Your Stew or Protein')}
            {renderCategory('greens', '3. Add Greens & Fresh Relish')}
            {renderCategory('extras', '4. Optional Street Extras')}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 font-bold underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Classic Combo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Plate Summary & Budget Meter */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
                isBudgetExceeded
                  ? 'bg-red-950/80 border-red-500/80 text-white'
                  : 'bg-[#0F291E] border-emerald-500/30 text-white'
              }`}
            >
              {/* Top Budget Status Indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#F5BA13]" />
                  <span className="font-extrabold text-sm uppercase tracking-wider text-emerald-200">
                    Plate Total
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-[#F5BA13]">
                    {totalCost} <span className="text-sm font-bold text-gray-300">KSh</span>
                  </div>
                </div>
              </div>

              {/* Visual Budget Progress Bar */}
              <div className="my-5">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-gray-300">Budget Spent:</span>
                  <span className={isBudgetExceeded ? 'text-red-400' : 'text-emerald-400'}>
                    {isBudgetExceeded
                      ? `Over by ${Math.abs(remainingBudget)} KSh!`
                      : `${remainingBudget} KSh remaining`}
                  </span>
                </div>

                <div className="w-full h-3.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isBudgetExceeded
                        ? 'bg-red-500'
                        : totalCost >= 85
                        ? 'bg-[#F5BA13]'
                        : 'bg-[#00843D]'
                    }`}
                    style={{ width: `${Math.min(totalCost, 100)}%` }}
                  />
                </div>
              </div>

              {/* Status Message */}
              {isBudgetExceeded ? (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-900/50 border border-red-500/40 text-xs font-medium text-red-200 mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                  <span>
                    Your plate exceeds the 100 Bob threshold by <strong>{Math.abs(remainingBudget)} KSh</strong>. Remove an extra or swap a protein to stay within 100 KSh.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/70 border border-emerald-400/50 text-xs font-bold text-emerald-300 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Approved 100 Bob Combo! Under budget by {remainingBudget} KSh.</span>
                </div>
              )}

              {/* Selected Items Breakdown List */}
              <div className="space-y-2 mb-6 max-h-56 overflow-y-auto pr-1">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Your Current Plate ({selectedItems.length} items):
                </div>
                {selectedItems.length === 0 ? (
                  <p className="text-xs text-gray-400 py-3 italic">
                    Select items on the left to start building your meal.
                  </p>
                ) : (
                  selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-white/5 rounded-lg border border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="font-semibold text-gray-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F5BA13]">{item.price} KSh</span>
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="text-gray-400 hover:text-red-400 p-0.5"
                          title="Remove item"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Combo Custom Name Input */}
              <div className="mb-5">
                <label className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                  Name Your Plate Combo:
                </label>
                <input
                  type="text"
                  value={customComboName}
                  onChange={(e) => setCustomComboName(e.target.value)}
                  placeholder="e.g. Campus Legend, Friday Energy..."
                  className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#00843D]"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isBudgetExceeded || selectedItems.length === 0}
                  onClick={() => onSaveComboToDrive(customComboName, selectedItems, totalCost)}
                  className="w-full py-3.5 px-4 rounded-full bg-[#00843D] hover:bg-[#006e33] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-98 border border-emerald-400/30"
                >
                  <Cloud className="w-4 h-4 text-[#F5BA13]" />
                  <span>Save This Plate to Google Drive</span>
                </button>

                <button
                  type="button"
                  disabled={selectedItems.length === 0}
                  onClick={() => onFindKibandaForCombo(customComboName)}
                  className="w-full py-3 px-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-500/20 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F5BA13]" />
                  <span>Find Vibandas Serving This</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
