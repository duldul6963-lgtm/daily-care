import React, { useState } from 'react';
import { MealRecord, MealId, MealStatusType, UserRole } from '../types';
import { playMealChime, playDropletSound } from '../utils/sound';
import { Utensils, CheckCircle2, XCircle, Clock, Send, MessageCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MealTrackerProps {
  meals: MealRecord[];
  role: UserRole;
  soundEnabled: boolean;
  onUpdateMeal: (mealId: MealId, status: MealStatusType, notes?: string) => void;
  onSendNudge: (text: string, emoji: string) => void;
}

export const MealTracker: React.FC<MealTrackerProps> = ({
  meals,
  role,
  soundEnabled,
  onUpdateMeal,
  onSendNudge,
}) => {
  const [activeNoteMealId, setActiveNoteMealId] = useState<MealId | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleAte = (meal: MealRecord) => {
    playMealChime(soundEnabled);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#34D399', '#FBBF24'],
    });
    onUpdateMeal(meal.id, 'ate');
  };

  const handleNotEaten = (meal: MealRecord) => {
    playDropletSound(soundEnabled);
    onUpdateMeal(meal.id, 'not_eaten');
  };

  const handleSaveNote = (mealId: MealId) => {
    if (noteText.trim()) {
      onUpdateMeal(mealId, 'ate', noteText.trim());
      setNoteText('');
      setActiveNoteMealId(null);
    }
  };

  const completedCount = meals.filter((m) => m.status === 'ate').length;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl border border-amber-200">
            🍳
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display">
              {role === 'admin' ? "Friend's Meals Today" : "Today's Meals"}
            </h3>
            <p className="text-xs text-slate-500">
              Breakfast, Lunch & Dinner check-ins
            </p>
          </div>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-stone-100 text-slate-700 border border-stone-200">
          {completedCount} / {meals.length} Completed
        </div>
      </div>

      {/* Meal Cards Grid */}
      <div className="space-y-3">
        {meals.map((meal) => {
          const isAte = meal.status === 'ate';
          const isNotEaten = meal.status === 'not_eaten';
          const isWaiting = meal.status === 'waiting';
          const isUpcoming = meal.status === 'upcoming';

          const formattedCompletedTime = meal.completedAt
            ? new Date(meal.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null;

          return (
            <div
              key={meal.id}
              className={`p-4 rounded-2xl border transition-all ${
                isAte
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : isNotEaten
                  ? 'bg-rose-50/40 border-rose-200'
                  : isWaiting
                  ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                  : 'bg-stone-50/60 border-stone-200/80 text-stone-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Meal info */}
                <div className="flex items-center gap-3">
                  <div className="text-2xl sm:text-3xl shrink-0 select-none">{meal.emoji}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-800">
                        {meal.name}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        {meal.time}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      {isAte && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={12} />
                          <span>Ate {formattedCompletedTime ? `at ${formattedCompletedTime}` : ''}</span>
                        </span>
                      )}
                      {isNotEaten && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md">
                          <XCircle size={12} />
                          <span>Didn't eat</span>
                        </span>
                      )}
                      {isWaiting && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                          <Clock size={12} />
                          <span>Waiting for response</span>
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-stone-200/80 px-2 py-0.5 rounded-md">
                          <span>Upcoming</span>
                        </span>
                      )}

                      {meal.notes && (
                        <span className="text-xs text-slate-600 italic bg-white px-2 py-0.5 rounded border border-stone-200">
                          "{meal.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {role === 'friend' ? (
                    <>
                      <button
                        onClick={() => handleAte(meal)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isAte
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        <CheckCircle2 size={13} />
                        <span>{isAte ? 'Ate' : 'Yes, I ate'}</span>
                      </button>

                      <button
                        onClick={() => handleNotEaten(meal)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isNotEaten
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-rose-100 text-slate-600 hover:text-rose-900 border border-stone-200'
                        }`}
                      >
                        <XCircle size={13} />
                        <span>No, haven't</span>
                      </button>

                      {/* Add quick note */}
                      <button
                        onClick={() => setActiveNoteMealId(activeNoteMealId === meal.id ? null : meal.id)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-stone-100"
                        title="Add dish note"
                      >
                        <MessageCircle size={15} />
                      </button>
                    </>
                  ) : (
                    /* Admin Quick Remind */
                    <button
                      onClick={() =>
                        onSendNudge(`Hey! It's ${meal.name.toLowerCase()} time 🐼 Have you eaten?`, meal.emoji)
                      }
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Send size={12} />
                      <span>Remind {meal.name}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Note input field if toggled */}
              {activeNoteMealId === meal.id && role === 'friend' && (
                <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="What did you have? (e.g. Oatmeal with fruit 🍓)"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNote(meal.id)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-slate-800 focus:outline-emerald-500"
                  />
                  <button
                    onClick={() => handleSaveNote(meal.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
