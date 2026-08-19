import React, { useState } from 'react';
import { PeriodCycleRecord, UserRole } from '../types';
import { playDropletSound } from '../utils/sound';
import { Sparkles, Heart, Coffee, Send, Calendar, Activity, Check } from 'lucide-react';
import { CozyTeaPanda } from './PandaIllustrations';

interface PeriodCycleCareProps {
  period: PeriodCycleRecord;
  role: UserRole;
  soundEnabled: boolean;
  onUpdatePeriod: (params: {
    lastPeriodStartDate?: string;
    cycleLengthDays?: number;
    periodDurationDays?: number;
    symptoms?: string[];
    flow?: 'light' | 'medium' | 'heavy';
    isPeriodActive?: boolean;
  }) => void;
  onSendNudge: (text: string, emoji: string) => void;
}

export const PeriodCycleCare: React.FC<PeriodCycleCareProps> = ({
  period,
  role,
  soundEnabled,
  onUpdatePeriod,
  onSendNudge,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(period.lastPeriodStartDate || '2026-08-10');
  const [cycleLength, setCycleLength] = useState(period.cycleLengthDays || 28);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(period.symptoms || []);

  const symptomOptions = [
    '🍵 Craving Warm Tea',
    '🛋️ Cozy Rest Needed',
    '🌸 Mild Cramps',
    '🥱 Sleepy & Low Energy',
    '⚡ Good Energy',
    '🍫 Comfort Snack',
  ];

  const getPhaseName = (phase: string, isActive: boolean) => {
    if (isActive) return 'Period Days (Rest & Care)';
    switch (phase) {
      case 'follicular':
        return 'Follicular Phase (Energy Building)';
      case 'ovulation':
        return 'Mid-Cycle (Peak Vitality)';
      case 'luteal':
        return 'Luteal Phase (Wind-down & Cozy)';
      default:
        return 'Regular Cycle';
    }
  };

  const toggleSymptom = (sym: string) => {
    playDropletSound(soundEnabled);
    const next = selectedSymptoms.includes(sym)
      ? selectedSymptoms.filter((s) => s !== sym)
      : [...selectedSymptoms, sym];
    setSelectedSymptoms(next);
    onUpdatePeriod({ symptoms: next });
  };

  const handleSaveSettings = () => {
    playDropletSound(soundEnabled);
    onUpdatePeriod({
      lastPeriodStartDate: startDate,
      cycleLengthDays: Number(cycleLength),
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl border border-rose-200">
            🌸
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display">
              {role === 'admin' ? "Friend's Cycle & Comfort Care" : 'Period Timing & Cycle Care'}
            </h3>
            <p className="text-xs text-slate-500">
              {getPhaseName(period.phase, period.isPeriodActive)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm sm:text-base font-extrabold text-rose-600">
            {period.isPeriodActive
              ? `Day ${period.currentCycleDay} of Period`
              : `Day ${period.currentCycleDay} of ${period.cycleLengthDays}`}
          </span>
          <span className="text-xs text-slate-500 block">
            {period.isPeriodActive
              ? 'Active period • Stay cozy 🍵'
              : `~${period.daysUntilNextPeriod} days to next cycle`}
          </span>
        </div>
      </div>

      {/* Cycle Indicator & Quick Comfort Care */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50/60 to-amber-50/50 border border-rose-200/80 mb-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
            {period.isPeriodActive ? '🍵' : '🌸'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 text-sm">
                {period.isPeriodActive ? 'Comfort & Warmth Mode 🧸' : 'Cycle Care Active'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                {period.isPeriodActive ? 'Period Active' : 'On Track'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {period.isPeriodActive
                ? 'Keep warm, drink herbal tea, and get plenty of rest!'
                : 'Stay hydrated with water and maintain your daily routine 🙂'}
            </p>
          </div>
        </div>

        {role === 'friend' ? (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-colors shadow-2xs self-end sm:self-auto"
          >
            {isEditing ? 'Close' : 'Cycle Dates'}
          </button>
        ) : (
          <button
            onClick={() =>
              onSendNudge(
                'Sending warm tea & cozy vibes 🍵🐼 Take it easy and take care of yourself today!',
                '🍵'
              )
            }
            className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold transition-colors flex items-center gap-1.5 self-end sm:self-auto"
          >
            <Send size={12} />
            <span>Send Comfort Vibes 🍵</span>
          </button>
        )}
      </div>

      {/* Best-Friend Comfort Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center">
          <span className="text-lg block mb-0.5">🍵</span>
          <span className="text-xs font-bold text-amber-900 block">Warm Herbal Tea</span>
          <span className="text-[10px] text-amber-700">Chamomile / Ginger</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-center">
          <span className="text-lg block mb-0.5">🛋️</span>
          <span className="text-xs font-bold text-rose-900 block">Heating Pad / Rest</span>
          <span className="text-[10px] text-rose-700">Cozy relaxation</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-center">
          <span className="text-lg block mb-0.5">💧</span>
          <span className="text-xs font-bold text-sky-900 block">Warm Hydration</span>
          <span className="text-[10px] text-sky-700">Prevents cramps</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center">
          <span className="text-lg block mb-0.5">🍫</span>
          <span className="text-xs font-bold text-emerald-900 block">Comfort Snack</span>
          <span className="text-[10px] text-emerald-700">Nourish your body</span>
        </div>
      </div>

      {/* 1-Tap Daily Comfort & Feeling Logger */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          {role === 'admin' ? "Friend's Logged Comfort Feelings:" : 'How are you feeling today? (Tap to log):'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {symptomOptions.map((sym) => {
            const isSelected = selectedSymptoms.includes(sym);
            return (
              <button
                key={sym}
                disabled={role === 'admin'}
                onClick={() => toggleSymptom(sym)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'bg-stone-50 text-slate-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {sym}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cycle Date Settings Drawer */}
      {isEditing && (
        <div className="mt-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 animate-in fade-in space-y-3">
          <h4 className="text-xs font-bold text-slate-800">Adjust Cycle Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Last Period Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Cycle Length (Days)
              </label>
              <input
                type="number"
                min={20}
                max={45}
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-white border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-xl bg-stone-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
            >
              Save Cycle Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
