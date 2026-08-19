import React from 'react';
import { CareState, MealId } from '../types';
import { WavingPanda, ThumbsUpPanda, WaterPanda, CheeringPanda, SleepingPanda, CozyTeaPanda } from './PandaIllustrations';
import { playDropletSound } from '../utils/sound';
import { Droplet, CheckCircle2, Clock, Sparkles, Moon, Heart } from 'lucide-react';

interface FriendDashboardProps {
  state: CareState;
  soundEnabled: boolean;
  onQuickDrinkWater: () => void;
  onQuickLogMeal: (mealId: MealId) => void;
  onQuickLogSleep: () => void;
}

export const FriendDashboard: React.FC<FriendDashboardProps> = ({
  state,
  soundEnabled,
  onQuickDrinkWater,
  onQuickLogMeal,
  onQuickLogSleep,
}) => {
  const completedMeals = state.meals.filter((m) => m.status === 'ate').length;
  const completedWater = state.waterSlots.filter((s) => s.status === 'completed').length;
  const totalWater = state.waterSlots.length;

  const nextPendingMeal = state.meals.find((m) => m.status === 'waiting' || m.status === 'upcoming');
  const nextWaterSlot = state.waterSlots.find((s) => s.status === 'waiting' || s.status === 'upcoming');

  const allDone = completedMeals === 3 && completedWater >= 6 && (state.sleep.hoursSlept || 0) >= 8;

  // Determine greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Good morning! 🐼'
      : hour < 17
      ? 'Good afternoon! 🐼'
      : hour < 21
      ? 'Good evening! 🐼'
      : 'Time to wind down! 🐼🌙';

  return (
    <div className="space-y-5">
      {/* Friendly Panda Hero Card */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-3xl p-5 sm:p-7 border border-emerald-200/80 shadow-xs text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          {/* Panda Speech Bubble */}
          <div className="relative mb-2 px-4 py-2 rounded-2xl bg-white border border-emerald-200 shadow-2xs max-w-sm text-xs sm:text-sm font-semibold text-slate-800 animate-gentle-float">
            <span>
              {allDone
                ? `Awesome job, ${state.friendName}! You took great care of your sleep, meals & water today! ⭐🐼`
                : state.period?.isPeriodActive
                ? `Hey ${state.friendName}! Take it extra easy today 🍵 Cozy rest & warm tea vibes!`
                : hour >= 22
                ? `Hey ${state.friendName}! Time to wind down and get your 8 hours of sleep 🐼🌙`
                : nextPendingMeal && nextPendingMeal.status === 'waiting'
                ? `Hey! It's ${nextPendingMeal.name.toLowerCase()} time 🐼 Have you eaten?`
                : nextWaterSlot
                ? `Stay refreshed! Time for some water 💧`
                : `Hey ${state.friendName}! Your best friend ${state.adminName} is checking in on you 🙂`}
            </span>
            <div className="w-2.5 h-2.5 bg-white border-b border-r border-emerald-200 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
          </div>

          {/* Interactive Panda Illustration */}
          <div
            className="my-1 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            onClick={() => playDropletSound(soundEnabled)}
            title="Tap your panda buddy!"
          >
            {state.period?.isPeriodActive ? (
              <CozyTeaPanda className="w-36 h-36 sm:w-44 sm:h-44" />
            ) : hour >= 22 || hour < 6 ? (
              <SleepingPanda className="w-36 h-36 sm:w-44 sm:h-44" />
            ) : allDone ? (
              <CheeringPanda className="w-36 h-36 sm:w-44 sm:h-44" />
            ) : completedWater < 3 ? (
              <WaterPanda className="w-36 h-36 sm:w-44 sm:h-44" />
            ) : (
              <ThumbsUpPanda className="w-36 h-36 sm:w-44 sm:h-44" />
            )}
          </div>

          {/* Header text */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-display mt-1">
            {greeting}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mt-0.5">
            Your best friend {state.adminName} is gently reminding you to take care of yourself.
          </p>

          {/* 1-Tap Fast Response Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button
              onClick={onQuickDrinkWater}
              className="px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Droplet size={14} className="fill-white" />
              <span>I drank water (+250ml) 💧</span>
            </button>

            {nextPendingMeal && nextPendingMeal.status !== 'ate' && (
              <button
                onClick={() => onQuickLogMeal(nextPendingMeal.id)}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>{nextPendingMeal.emoji}</span>
                <span>Yes, I ate {nextPendingMeal.name}</span>
              </button>
            )}

            <button
              onClick={onQuickLogSleep}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Moon size={14} />
              <span>Logged 8h Sleep 🌙</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Reminders Overview Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <h3 className="font-extrabold text-base sm:text-lg text-slate-800 font-display mb-3">
          Today's Reminders & Routine
        </h3>

        <div className="space-y-2.5">
          {/* 8 Hours Sleep */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🌙</span>
              <span className="font-bold text-slate-800">8h Sleep Routine</span>
            </div>
            <span className="font-bold text-xs px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-800">
              {state.sleep.hoursSlept ? `${state.sleep.hoursSlept}h / 8h ✅` : '8h Target ⏳'}
            </span>
          </div>

          {/* Period / Cycle Care */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 border border-rose-200/80 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🌸</span>
              <span className="font-bold text-slate-800">Period & Cycle Care</span>
            </div>
            <span className="font-bold text-xs px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800">
              {state.period.isPeriodActive
                ? `Day ${state.period.currentCycleDay} (Period Active 🍵)`
                : `Day ${state.period.currentCycleDay} (~${state.period.daysUntilNextPeriod}d next)`}
            </span>
          </div>

          {/* Breakfast */}
          {state.meals.find((m) => m.id === 'breakfast') && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🍳</span>
                <span className="font-bold text-slate-800">Breakfast</span>
              </div>
              <span
                className={`font-bold text-xs px-2.5 py-1 rounded-xl ${
                  state.meals.find((m) => m.id === 'breakfast')?.status === 'ate'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {state.meals.find((m) => m.id === 'breakfast')?.status === 'ate' ? '✅ Done' : '⏳ Waiting'}
              </span>
            </div>
          )}

          {/* Water */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/60 border border-sky-200/80 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">💧</span>
              <span className="font-bold text-slate-800">Water</span>
            </div>
            <span className="font-bold text-xs px-2.5 py-1 rounded-xl bg-sky-100 text-sky-800">
              {completedWater} / {totalWater} completed
            </span>
          </div>

          {/* Lunch */}
          {state.meals.find((m) => m.id === 'lunch') && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🍛</span>
                <span className="font-bold text-slate-800">Lunch</span>
              </div>
              <span
                className={`font-bold text-xs px-2.5 py-1 rounded-xl ${
                  state.meals.find((m) => m.id === 'lunch')?.status === 'ate'
                    ? 'bg-emerald-100 text-emerald-800'
                    : state.meals.find((m) => m.id === 'lunch')?.status === 'waiting'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-stone-200 text-slate-600'
                }`}
              >
                {state.meals.find((m) => m.id === 'lunch')?.status === 'ate'
                  ? '✅ Done'
                  : state.meals.find((m) => m.id === 'lunch')?.status === 'waiting'
                  ? '⏳ Waiting'
                  : '🔵 Upcoming'}
              </span>
            </div>
          )}

          {/* Next Water Reminder */}
          {nextWaterSlot && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">💧</span>
                <span className="font-bold text-slate-800">Next water reminder</span>
              </div>
              <span className="font-bold text-xs px-2.5 py-1 rounded-xl bg-teal-100 text-teal-900">
                {nextWaterSlot.time}
              </span>
            </div>
          )}

          {/* Dinner */}
          {state.meals.find((m) => m.id === 'dinner') && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🍽️</span>
                <span className="font-bold text-slate-800">Dinner</span>
              </div>
              <span
                className={`font-bold text-xs px-2.5 py-1 rounded-xl ${
                  state.meals.find((m) => m.id === 'dinner')?.status === 'ate'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-slate-600'
                }`}
              >
                {state.meals.find((m) => m.id === 'dinner')?.status === 'ate'
                  ? '✅ Done'
                  : state.meals.find((m) => m.id === 'dinner')?.time || '8:00 PM'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
