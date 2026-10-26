/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Utensils,
  Clock,
  Coffee,
  Sun,
  Moon,
  Cookie,
  RotateCcw,
  Cloud,
  ChevronRight,
  Flame,
  ShieldCheck,
  Award,
  BarChart3,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { DailyBudgetExpense } from '../types';

interface DailyBudgetTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: DailyBudgetExpense[];
  onAddExpense: (expense: Omit<DailyBudgetExpense, 'id' | 'time'>) => void;
  onRemoveExpense: (id: string) => void;
  onResetToday: () => void;
  dailyGoal?: number;
  onUpdateDailyGoal?: (newGoal: number) => void;
  onOpenDriveModal?: () => void;
}

export default function DailyBudgetTracker({
  isOpen,
  onClose,
  expenses,
  onAddExpense,
  onRemoveExpense,
  onResetToday,
  dailyGoal = 100,
  onUpdateDailyGoal,
  onOpenDriveModal,
}: DailyBudgetTrackerProps) {
  // New expense form state
  const [mealName, setMealName] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState<DailyBudgetExpense['category']>('lunch');
  const [spotName, setSpotName] = useState('');
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');

  // Quick 1-Tap Presets commonly consumed in Kenyan kibandas
  const quickPresets = [
    { label: 'Chai + Chapo', cost: 30, category: 'breakfast' as const },
    { label: 'Ndondo (Beans) Half', cost: 40, category: 'lunch' as const },
    { label: 'Single Smocha', cost: 40, category: 'snack' as const },
    { label: 'Chapo Madondo Full', cost: 80, category: 'lunch' as const },
    { label: 'Ugali Sukuma', cost: 60, category: 'dinner' as const },
    { label: 'Double Smocha Deluxe', cost: 70, category: 'snack' as const },
    { label: 'Mandazi Mbili', cost: 20, category: 'breakfast' as const },
    { label: 'Supu ya Mifupa', cost: 20, category: 'snack' as const },
  ];

  // Calculations
  const totalSpent = expenses.reduce((sum, item) => sum + item.cost, 0);
  const remainingBob = dailyGoal - totalSpent;
  const percentageUsed = Math.min(100, Math.round((totalSpent / dailyGoal) * 100));
  const isOverBudget = totalSpent > dailyGoal;
  const isExactGoal = totalSpent === dailyGoal;
  const isSafe = totalSpent < dailyGoal;

  // Generate 7-day weekly trends data incorporating today's live logged expenses
  const weeklyTrendsData = useMemo(() => {
    const historyTemplate = [
      { day: 'Mon', date: 'Mon Oct 01', base: 75, meals: 2 },
      { day: 'Tue', date: 'Tue Oct 02', base: 90, meals: 3 },
      { day: 'Wed', date: 'Wed Oct 03', base: 60, meals: 2 },
      { day: 'Thu', date: 'Thu Oct 04', base: 85, meals: 3 },
      { day: 'Fri', date: 'Fri Oct 05', base: 100, meals: 3 },
      { day: 'Sat', date: 'Sat Oct 06', base: 95, meals: 3 },
      { day: 'Today', date: 'Today (Live)', base: totalSpent, meals: expenses.length, isToday: true },
    ];

    return historyTemplate.map((item) => {
      const spent = item.isToday ? totalSpent : item.base;
      const meals = item.isToday ? expenses.length : item.meals;
      const isOver = spent > dailyGoal;
      return {
        day: item.day,
        date: item.date,
        spent,
        goal: dailyGoal,
        saved: Math.max(0, dailyGoal - spent),
        meals,
        isToday: Boolean(item.isToday),
        isOver,
      };
    });
  }, [totalSpent, expenses.length, dailyGoal]);

  const weeklyTotalSpent = weeklyTrendsData.reduce((sum, d) => sum + d.spent, 0);
  const weeklyAvgSpend = Math.round(weeklyTotalSpent / weeklyTrendsData.length);
  const daysUnderBudgetCount = weeklyTrendsData.filter((d) => d.spent <= dailyGoal).length;
  const weeklyEstimatedSavings = weeklyTrendsData.length * 450 - weeklyTotalSpent;

  // Category Icons helper
  const getCategoryIcon = (cat: DailyBudgetExpense['category']) => {
    switch (cat) {
      case 'breakfast':
        return <Coffee className="w-3.5 h-3.5 text-amber-500" />;
      case 'lunch':
        return <Sun className="w-3.5 h-3.5 text-emerald-500" />;
      case 'dinner':
        return <Moon className="w-3.5 h-3.5 text-indigo-500" />;
      case 'snack':
        return <Cookie className="w-3.5 h-3.5 text-yellow-500" />;
      case 'drink':
        return <Coffee className="w-3.5 h-3.5 text-cyan-500" />;
      default:
        return <Utensils className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCost = parseInt(cost, 10);
    if (!mealName.trim() || isNaN(parsedCost) || parsedCost <= 0) return;

    onAddExpense({
      mealName: mealName.trim(),
      cost: parsedCost,
      category,
      spotName: spotName.trim() || undefined,
    });

    setMealName('');
    setCost('');
    setSpotName('');
    setIsCustomFormOpen(false);
  };

  const handleQuickAdd = (preset: { label: string; cost: number; category: DailyBudgetExpense['category'] }) => {
    onAddExpense({
      mealName: preset.label,
      cost: preset.cost,
      category: preset.category,
      spotName: 'Neighborhood Kibanda',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div className="relative w-full max-w-md bg-[#F8F9F5] text-[#0C1E17] h-full shadow-2xl flex flex-col z-10 border-l border-emerald-900/10 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-gray-200 bg-[#081C15] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00843D] flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xs">100/=</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight flex items-center gap-1.5">
                <span>Daily Budget Tracker</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#F5BA13] text-[#081C15]">
                  Live
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200/80">
                Kula na 100 Bob: Log today&apos;s meal spend
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Budget Tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* 1. MAIN BUDGET GAUGE CARD */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                Today&apos;s Budget Gauge
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-500">Goal:</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  {dailyGoal} KSh
                </span>
              </div>
            </div>

            {/* Big Numbers Row */}
            <div className="grid grid-cols-2 gap-3 items-center pt-1">
              {/* Total Spent */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-[10px] font-black uppercase text-gray-400">Total Spent</div>
                <div
                  className={`text-2xl sm:text-3xl font-black ${
                    isOverBudget ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {totalSpent}
                  <span className="text-sm font-bold text-gray-500 ml-1">KSh</span>
                </div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                  {expenses.length} meal{expenses.length !== 1 ? 's' : ''} logged
                </div>
              </div>

              {/* Remaining */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  isOverBudget
                    ? 'bg-red-50 border-red-200'
                    : isExactGoal
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="text-[10px] font-black uppercase text-gray-500">
                  {isOverBudget ? 'Over Limit' : 'Remaining'}
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-black ${
                    isOverBudget
                      ? 'text-red-600'
                      : isExactGoal
                      ? 'text-amber-600'
                      : 'text-[#00843D]'
                  }`}
                >
                  {Math.abs(remainingBob)}
                  <span className="text-sm font-bold text-gray-500 ml-1">Bob</span>
                </div>
                <div className="text-[10px] font-bold text-gray-600 mt-0.5">
                  {isOverBudget
                    ? '⚠️ Goal exceeded'
                    : isExactGoal
                    ? '🎯 Perfect 100 Bob!'
                    : 'Left to spend today'}
                </div>
              </div>
            </div>

            {/* Visual Progress Meter Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-600">{percentageUsed}% of 100 Bob used</span>
                <span
                  className={`font-black ${
                    isOverBudget
                      ? 'text-red-600'
                      : isExactGoal
                      ? 'text-amber-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {isOverBudget ? 'Exceeded' : `${remainingBob} Bob safe`}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget
                      ? 'bg-red-500'
                      : percentageUsed >= 85
                      ? 'bg-amber-500'
                      : 'bg-[#00843D]'
                  }`}
                  style={{ width: `${Math.min(100, (totalSpent / dailyGoal) * 100)}%` }}
                />
              </div>
            </div>

            {/* Status Message Pill */}
            <div
              className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold ${
                isOverBudget
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : isExactGoal
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              }`}
            >
              {isOverBudget ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>You exceeded your 100 Bob target by {totalSpent - dailyGoal} KSh. Try a 20 Bob chai or ndondo tomorrow!</span>
                </>
              ) : isExactGoal ? (
                <>
                  <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Spot on! You used exactly 100 Bob today. Champion budget dining!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#00843D] flex-shrink-0" />
                  <span>
                    Great discipline! You still have <strong>{remainingBob} Bob</strong> to grab an evening smocha or chai.
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 2. WEEKLY MEAL SPEND TRENDS CHART (RECHARTS) */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#00843D]" />
                  <span>Weekly Meal Spend Trends</span>
                </span>
                <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                  Daily totals vs 100 Bob goal cap
                </span>
              </div>

              {/* Chart Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartType === 'bar'
                      ? 'bg-white text-[#00843D] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Bar Chart View"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('area')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartType === 'area'
                      ? 'bg-white text-[#00843D] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Area Trend View"
                >
                  <LineChartIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Weekly Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-center">
              <div>
                <div className="text-[9px] uppercase font-black text-gray-400">Weekly Avg</div>
                <div className="text-xs sm:text-sm font-black text-emerald-950">{weeklyAvgSpend} KSh</div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-black text-gray-400">Under 100 Bob</div>
                <div className="text-xs sm:text-sm font-black text-[#00843D]">
                  {daysUnderBudgetCount}/7 Days
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-black text-gray-400">Est. Saved</div>
                <div className="text-xs sm:text-sm font-black text-amber-700">
                  +{weeklyEstimatedSavings} KSh
                </div>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={weeklyTrendsData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: '#4B5563', fontWeight: 700 }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                      domain={[0, 140]}
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickLine={false}
                      axisLine={false}
                      unit="KSh"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#081C15] text-white p-2.5 rounded-xl border border-emerald-500/30 text-xs shadow-xl space-y-1">
                              <div className="font-black text-[#F5BA13] flex items-center justify-between gap-3">
                                <span>{data.date}</span>
                                {data.isToday && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#00843D] text-white font-bold">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-extrabold text-white">
                                {data.spent} KSh <span className="text-[10px] text-gray-400 font-normal">({data.meals} meals)</span>
                              </div>
                              <div className={`text-[10px] font-bold ${data.isOver ? 'text-red-400' : 'text-emerald-400'}`}>
                                {data.isOver
                                  ? `Over budget by ${data.spent - data.goal} Bob`
                                  : `${data.goal - data.spent} Bob remaining`}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine
                      y={dailyGoal}
                      stroke="#EF4444"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `${dailyGoal}/= Goal Cap`,
                        position: 'top',
                        fill: '#DC2626',
                        fontSize: 9,
                        fontWeight: 900,
                      }}
                    />
                    <Bar dataKey="spent" radius={[6, 6, 0, 0]} maxBarSize={32}>
                      {weeklyTrendsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.spent > dailyGoal ? '#EF4444' : entry.isToday ? '#00843D' : '#10B981'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <AreaChart data={weeklyTrendsData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00843D" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00843D" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: '#4B5563', fontWeight: 700 }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                      domain={[0, 140]}
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickLine={false}
                      axisLine={false}
                      unit="KSh"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#081C15] text-white p-2.5 rounded-xl border border-emerald-500/30 text-xs shadow-xl space-y-1">
                              <div className="font-black text-[#F5BA13] flex items-center justify-between gap-3">
                                <span>{data.date}</span>
                                {data.isToday && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#00843D] text-white font-bold">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-extrabold text-white">
                                {data.spent} KSh
                              </div>
                              <div className={`text-[10px] font-bold ${data.isOver ? 'text-red-400' : 'text-emerald-400'}`}>
                                {data.isOver ? 'Over budget' : 'Under 100 Bob goal'}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine
                      y={dailyGoal}
                      stroke="#EF4444"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="spent"
                      stroke="#00843D"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#spendGradient)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Legend Indicators */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-500 pt-1 border-t border-gray-100 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00843D]" />
                <span>≤{dailyGoal} Bob (Target Met)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Over Limit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t border-dashed border-red-500" />
                <span>100 Bob Cap</span>
              </div>
            </div>
          </div>

          {/* 3. QUICK 1-TAP MEAL ADD BUTTONS */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#F5BA13]" />
                <span>Quick 1-Tap Kibanda Add</span>
              </span>
              <span className="text-[10px] text-gray-400 font-semibold">Common Prices</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAdd(preset)}
                  className="p-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-gray-800 hover:text-emerald-900 border border-gray-200 hover:border-emerald-300 text-left transition-all active:scale-95 shadow-sm group flex flex-col justify-between"
                >
                  <div className="text-[11px] font-bold truncate group-hover:text-[#00843D]">
                    {preset.label}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-black text-[#00843D]">+{preset.cost}/=</span>
                    <span className="w-4 h-4 rounded-full bg-gray-100 group-hover:bg-[#00843D] group-hover:text-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                      +
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. LOG CUSTOM MEAL FORM */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setIsCustomFormOpen(!isCustomFormOpen)}
              className="w-full p-3.5 flex items-center justify-between text-xs font-black uppercase text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00843D]" />
                <span>Log Custom Meal or Snack</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isCustomFormOpen ? 'rotate-90' : ''
                }`}
              />
            </button>

            {isCustomFormOpen && (
              <form onSubmit={handleCustomSubmit} className="p-4 pt-1 border-t border-gray-100 space-y-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                    Meal / Food Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="e.g. Chapo Dengu, Chai, Smocha, Githeri..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00843D] focus:border-[#00843D] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                      Cost (KSh) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="500"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00843D] focus:border-[#00843D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                      Meal Timing
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DailyBudgetExpense['category'])}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00843D] focus:border-[#00843D] outline-none bg-white"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack / Smocha</option>
                      <option value="drink">Drink / Chai</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                    Eatery or Joint Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    placeholder="e.g. Kibanda Tamu Ngara, Mama Oliech"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00843D] focus:border-[#00843D] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#00843D] hover:bg-[#006e33] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95"
                >
                  Log To Today&apos;s Spend
                </button>
              </form>
            )}
          </div>

          {/* 4. TODAY'S EXPENSE LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#00843D]" />
                <span>Today&apos;s Food Log ({expenses.length})</span>
              </span>

              {expenses.length > 0 && (
                <button
                  onClick={onResetToday}
                  className="text-[11px] text-gray-400 hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
                  title="Clear today's logs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Today</span>
                </button>
              )}
            </div>

            {expenses.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#00843D] mx-auto flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-gray-800">No meals logged yet today!</div>
                <div className="text-[11px] text-gray-500">
                  Tap a quick kibanda button above or log what you ate to keep tabs on your 100 Bob goal.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {expenses.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-gray-200 flex items-center justify-between gap-3 shadow-xs hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {item.mealName}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span>{item.time}</span>
                          {item.spotName && (
                            <>
                              <span>•</span>
                              <span className="truncate">{item.spotName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-black text-gray-900 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                        {item.cost} KSh
                      </span>
                      <button
                        onClick={() => onRemoveExpense(item.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. 100 BOB SAVINGS HIGHLIGHT CARD */}
          <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-2 border border-emerald-500/30 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#F5BA13]">
                <Sparkles className="w-3.5 h-3.5 fill-[#F5BA13]" />
                <span>The 100 Bob Advantage</span>
              </div>
              <span className="text-[10px] bg-[#00843D] text-white px-2 py-0.5 rounded-full font-bold">
                Smart Savings
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
              Eating authentic kibanda meals capped at 100 Bob saves Kenyans on average <strong>350–500 KSh per day</strong> compared to fast-food chains. That&apos;s over <strong>12,000 KSh saved every month!</strong>
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-white space-y-2">
          {onOpenDriveModal && (
            <button
              onClick={() => {
                onClose();
                onOpenDriveModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00843D] font-bold text-xs uppercase transition-all border border-emerald-200"
            >
              <Cloud className="w-4 h-4" />
              <span>Backup Saved Spots & Combos to Google Drive</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            Done Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
