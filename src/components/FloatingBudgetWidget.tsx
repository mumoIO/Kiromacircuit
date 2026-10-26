/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Utensils, AlertTriangle, Sparkles } from 'lucide-react';
import { DailyBudgetExpense } from '../types';

interface FloatingBudgetWidgetProps {
  expenses: DailyBudgetExpense[];
  dailyGoal?: number;
  onOpenTracker: () => void;
}

export default function FloatingBudgetWidget({
  expenses,
  dailyGoal = 100,
  onOpenTracker,
}: FloatingBudgetWidgetProps) {
  const totalSpent = expenses.reduce((sum, item) => sum + item.cost, 0);
  const remainingBob = dailyGoal - totalSpent;
  const isOverBudget = totalSpent > dailyGoal;
  const isExactGoal = totalSpent === dailyGoal;
  const percentage = Math.min(100, Math.round((totalSpent / dailyGoal) * 100));

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 animate-fade-in">
      <button
        onClick={onOpenTracker}
        title="Open Daily 100 Bob Budget Tracker"
        className={`group flex items-center gap-2.5 p-2 sm:px-3.5 sm:py-2.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border backdrop-blur-md ${
          isOverBudget
            ? 'bg-red-950/90 text-red-100 border-red-500/50 shadow-red-950/40 ring-1 ring-red-400'
            : isExactGoal
            ? 'bg-amber-950/90 text-amber-100 border-amber-500/50 shadow-amber-950/40'
            : 'bg-[#081C15]/95 text-white border-emerald-500/30 shadow-emerald-950/40 ring-1 ring-emerald-500/30'
        }`}
      >
        {/* Left Circle Meter */}
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black shadow-inner ${
            isOverBudget
              ? 'bg-red-600 text-white'
              : isExactGoal
              ? 'bg-amber-500 text-black'
              : 'bg-[#00843D] text-white'
          }`}
        >
          {isOverBudget ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <span className="text-[10px] font-black">{percentage}%</span>
          )}
        </div>

        {/* Text Details */}
        <div className="text-left hidden xs:block sm:block pr-1">
          <div className="flex items-center gap-1.5 leading-none mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">
              Daily Spend
            </span>
            <span
              className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                isOverBudget
                  ? 'bg-red-500/30 text-red-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {isOverBudget ? 'Over Target' : `${remainingBob} Bob Left`}
            </span>
          </div>
          <div className="text-xs font-black text-white flex items-center gap-1">
            <span>
              {totalSpent}/{dailyGoal} KSh
            </span>
            <span className="text-[10px] text-gray-400 font-normal">
              ({expenses.length} meal{expenses.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>

        {/* Action Prompt */}
        <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-[#00843D] flex items-center justify-center text-gray-300 group-hover:text-white transition-colors ml-1">
          <Utensils className="w-3 h-3 text-[#F5BA13]" />
        </div>
      </button>
    </div>
  );
}
