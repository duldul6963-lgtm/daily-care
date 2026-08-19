import React from 'react';
import { MealId } from '../types';
import { Bell, CheckCircle2, XCircle, Droplet, Clock, X, Moon, Heart } from 'lucide-react';

export interface ActiveReminder {
  id: string;
  type: 'meal' | 'water' | 'sleep' | 'period' | 'nudge';
  title: string;
  message: string;
  mealId?: MealId;
  slotId?: string;
  emoji?: string;
}

interface LiveNotificationToastProps {
  reminder: ActiveReminder | null;
  onAcknowledgeMeal: (mealId: MealId, status: 'ate' | 'not_eaten') => void;
  onAcknowledgeWater: (slotId?: string, status?: 'completed' | 'not_yet') => void;
  onAcknowledgeSleep: (hours: number, quality: 'great' | 'okay' | 'tired') => void;
  onAcknowledgePeriod: (comfortAction: string) => void;
  onDismiss: () => void;
}

export const LiveNotificationToast: React.FC<LiveNotificationToastProps> = ({
  reminder,
  onAcknowledgeMeal,
  onAcknowledgeWater,
  onAcknowledgeSleep,
  onAcknowledgePeriod,
  onDismiss,
}) => {
  if (!reminder) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-700/80 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg border border-emerald-500/30 shrink-0">
              {reminder.emoji || '🐼'}
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Daily Care 🐼
              </span>
              <h4 className="font-bold text-sm text-white leading-tight">
                {reminder.title}
              </h4>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 transition-colors"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message body */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 pl-1">
          {reminder.message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {reminder.type === 'meal' && reminder.mealId && (
            <>
              <button
                onClick={() => {
                  onAcknowledgeMeal(reminder.mealId!, 'ate');
                  onDismiss();
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Yes, I ate</span>
              </button>

              <button
                onClick={() => {
                  onAcknowledgeMeal(reminder.mealId!, 'not_eaten');
                  onDismiss();
                }}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <XCircle size={14} />
                <span>No, haven't eaten</span>
              </button>
            </>
          )}

          {reminder.type === 'water' && (
            <>
              <button
                onClick={() => {
                  onAcknowledgeWater(reminder.slotId, 'completed');
                  onDismiss();
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Droplet size={14} className="fill-white" />
                <span>Yes, I drank water</span>
              </button>

              <button
                onClick={() => {
                  onAcknowledgeWater(reminder.slotId, 'not_yet');
                  onDismiss();
                }}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Clock size={14} />
                <span>Not yet</span>
              </button>
            </>
          )}

          {reminder.type === 'sleep' && (
            <>
              <button
                onClick={() => {
                  onAcknowledgeSleep(8, 'great');
                  onDismiss();
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Moon size={14} />
                <span>Yes, got 8h sleep 😴</span>
              </button>

              <button
                onClick={() => {
                  onAcknowledgeSleep(6.5, 'tired');
                  onDismiss();
                }}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <span>A bit tired 🥱</span>
              </button>
            </>
          )}

          {reminder.type === 'period' && (
            <>
              <button
                onClick={() => {
                  onAcknowledgePeriod('🍵 Warm herbal tea');
                  onDismiss();
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>🍵 Warm tea & cozy</span>
              </button>

              <button
                onClick={() => {
                  onAcknowledgePeriod('🛋️ Cozy Rest');
                  onDismiss();
                }}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <span>Taking it easy 🛋️</span>
              </button>
            </>
          )}

          {reminder.type === 'nudge' && (
            <button
              onClick={onDismiss}
              className="w-full py-2 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all text-center"
            >
              Okay, thanks buddy! 🐼
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
