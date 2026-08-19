import React from 'react';
import { WaterSlotRecord, WaterSlotStatusType, UserRole } from '../types';
import { playDropletSound } from '../utils/sound';
import { Droplet, Check, Clock, Plus, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerProps {
  waterSlots: WaterSlotRecord[];
  totalDrunkMl: number;
  dailyGoalMl: number;
  role: UserRole;
  soundEnabled: boolean;
  onUpdateSlot: (slotId: string, status: WaterSlotStatusType) => void;
  onAddManualWater: (amountMl: number) => void;
  onSendNudge: (text: string, emoji: string) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  waterSlots,
  totalDrunkMl,
  dailyGoalMl,
  role,
  soundEnabled,
  onUpdateSlot,
  onAddManualWater,
  onSendNudge,
}) => {
  const completedSlots = waterSlots.filter((s) => s.status === 'completed').length;
  const totalSlots = waterSlots.length;
  const progressPercent = Math.min(100, Math.round((completedSlots / totalSlots) * 100));

  const handleSlotToggle = (slot: WaterSlotRecord) => {
    playDropletSound(soundEnabled);
    if (slot.status === 'completed') {
      onUpdateSlot(slot.id, 'waiting');
    } else {
      if (completedSlots + 1 === totalSlots) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284C7', '#38BDF8', '#34D399'],
        });
      }
      onUpdateSlot(slot.id, 'completed');
    }
  };

  const handleQuickGlass = () => {
    playDropletSound(soundEnabled);
    onAddManualWater(250);
  };

  // Find next upcoming/waiting slot
  const nextSlot = waterSlots.find((s) => s.status === 'waiting' || s.status === 'upcoming');

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl border border-sky-200">
            💧
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display">
              {role === 'admin' ? "Friend's Water Today" : '2-Hour Hydration Schedule'}
            </h3>
            <p className="text-xs text-slate-500">
              7:00 AM to 10:00 PM • 2-hour intervals
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm sm:text-base font-extrabold text-sky-700">
            {completedSlots} / {totalSlots}
          </span>
          <span className="text-xs text-slate-500 block">completed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
          <span>{totalDrunkMl} ml recorded</span>
          <span>Goal: {dailyGoalMl} ml ({progressPercent}%)</span>
        </div>
      </div>

      {/* 8-Slot Grid (2-hourly from 7 AM to 9 PM) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {waterSlots.map((slot) => {
          const isDone = slot.status === 'completed';
          const isNotYet = slot.status === 'not_yet';
          const isWaiting = slot.status === 'waiting';
          const isUpcoming = slot.status === 'upcoming';

          return (
            <div
              key={slot.id}
              onClick={() => role === 'friend' && handleSlotToggle(slot)}
              className={`p-3 rounded-2xl border transition-all text-left relative ${
                role === 'friend' ? 'cursor-pointer select-none active:scale-95' : ''
              } ${
                isDone
                  ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-2xs'
                  : isNotYet
                  ? 'bg-stone-100 border-stone-300 text-slate-400'
                  : isWaiting
                  ? 'bg-amber-50/70 border-amber-300 text-slate-800'
                  : 'bg-stone-50 border-stone-200 text-slate-500 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-800 font-display">
                  {slot.time}
                </span>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isDone
                      ? 'bg-sky-500 text-white font-bold'
                      : isWaiting
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : isWaiting ? <Clock size={11} /> : '•'}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium">
                <span className="text-slate-500">{slot.targetMl} ml</span>
                <span
                  className={`text-[10px] font-bold ${
                    isDone
                      ? 'text-sky-700'
                      : isWaiting
                      ? 'text-amber-700'
                      : 'text-slate-400'
                  }`}
                >
                  {isDone ? 'Drank ✅' : isWaiting ? 'Pending ⏳' : 'Upcoming'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
        {role === 'friend' ? (
          <>
            <button
              onClick={handleQuickGlass}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>I just drank a glass (+250ml) 💧</span>
            </button>

            {nextSlot && (
              <span className="text-xs text-slate-500">
                Next scheduled reminder: <strong className="text-slate-700">{nextSlot.time}</strong>
              </span>
            )}
          </>
        ) : (
          /* Admin Water Nudge */
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {completedSlots >= 6 ? 'Great hydration today!' : 'Remind friend for their next glass'}
            </span>
            <button
              onClick={() => onSendNudge('Time for some water 💧 Did you drink water?', '💧')}
              className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Send size={12} />
              <span>Nudge Water 💧</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
