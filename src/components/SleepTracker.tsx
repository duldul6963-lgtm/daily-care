import React, { useState } from 'react';
import { SleepRecord, UserRole } from '../types';
import { playDropletSound } from '../utils/sound';
import { Moon, Sun, Clock, CheckCircle2, Sparkles, Send, Battery, BatteryCharging } from 'lucide-react';
import { SleepingPanda } from './PandaIllustrations';
import confetti from 'canvas-confetti';

interface SleepTrackerProps {
  sleep: SleepRecord;
  role: UserRole;
  soundEnabled: boolean;
  onUpdateSleep: (params: {
    hoursSlept?: number;
    quality?: 'great' | 'okay' | 'tired';
    notes?: string;
  }) => void;
  onSendNudge: (text: string, emoji: string) => void;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({
  sleep,
  role,
  soundEnabled,
  onUpdateSleep,
  onSendNudge,
}) => {
  const [selectedHours, setSelectedHours] = useState<number>(sleep.hoursSlept || 8);
  const [selectedQuality, setSelectedQuality] = useState<'great' | 'okay' | 'tired'>(
    sleep.quality || 'great'
  );
  const [isEditing, setIsEditing] = useState(false);

  const hoursOptions = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5];
  const target = sleep.targetHours || 8;
  const currentHours = sleep.hoursSlept !== undefined ? sleep.hoursSlept : 8;
  const progressPercent = Math.min(100, Math.round((currentHours / target) * 100));

  const handleSaveSleep = (hours: number, quality: 'great' | 'okay' | 'tired') => {
    playDropletSound(soundEnabled);
    if (hours >= 8) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#818CF8', '#A78BFA', '#34D399'],
      });
    }
    onUpdateSleep({ hoursSlept: hours, quality });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl border border-indigo-200">
            🌙
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display">
              {role === 'admin' ? "Friend's 8h Sleep & Rest" : '8 Hours Sleep Routine'}
            </h3>
            <p className="text-xs text-slate-500">
              Bedtime {sleep.bedtime || '11:00 PM'} • Wake {sleep.wakeTime || '7:00 AM'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm sm:text-base font-extrabold text-indigo-700">
            {currentHours.toFixed(1)} / {target} hrs
          </span>
          <span className="text-xs text-slate-500 block">
            {currentHours >= target ? 'Goal achieved ⭐' : `${(target - currentHours).toFixed(1)}h remaining`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
          <span>Target: {target} hours rest</span>
          <span className="capitalize">
            Status: {sleep.quality ? `${sleep.quality} quality` : 'Well rested'}
          </span>
        </div>
      </div>

      {/* Sleep Status Card */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 mb-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
            {sleep.quality === 'great' ? '⚡' : sleep.quality === 'tired' ? '🥱' : '😴'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 text-sm">
                {currentHours} Hours of Sleep
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                {currentHours >= 8 ? '8h Rested ✅' : 'Light Sleep'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {sleep.quality === 'great'
                ? 'High energy, great rest!'
                : sleep.quality === 'tired'
                ? 'Feeling a little sleepy today'
                : 'Decent rest, feeling okay'}
            </p>
          </div>
        </div>

        {role === 'friend' ? (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors shadow-2xs self-end sm:self-auto"
          >
            {isEditing ? 'Close' : 'Log Sleep'}
          </button>
        ) : (
          <button
            onClick={() =>
              onSendNudge(
                'Hey buddy! Remember to get your full 8 hours of sleep tonight 🐼🌙 Rest well!',
                '🌙'
              )
            }
            className="px-3.5 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-bold transition-colors flex items-center gap-1.5 self-end sm:self-auto"
          >
            <Send size={12} />
            <span>Nudge Bedtime 🌙</span>
          </button>
        )}
      </div>

      {/* Sleep Quick Logger Drawer for Friend */}
      {isEditing && role === 'friend' && (
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 animate-in fade-in space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              How many hours did you sleep?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {hoursOptions.map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHours(h)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedHours === h
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {h} hrs
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              How do you feel this morning?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedQuality('great')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  selectedQuality === 'great'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-stone-200'
                }`}
              >
                <span>⚡</span>
                <span>Great</span>
              </button>
              <button
                onClick={() => setSelectedQuality('okay')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  selectedQuality === 'okay'
                    ? 'bg-indigo-100 text-indigo-900 border-indigo-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-stone-200'
                }`}
              >
                <span>😴</span>
                <span>Rested</span>
              </button>
              <button
                onClick={() => setSelectedQuality('tired')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  selectedQuality === 'tired'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-stone-200'
                }`}
              >
                <span>🥱</span>
                <span>Tired</span>
              </button>
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
              onClick={() => handleSaveSleep(selectedHours, selectedQuality)}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
            >
              Save Sleep Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
