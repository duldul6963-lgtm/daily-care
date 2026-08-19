import React, { useState } from 'react';
import { CareState, CareSettings, MealRecord } from '../types';
import {
  Clock,
  Send,
  Droplet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings as SettingsIcon,
  RotateCcw,
  Calendar,
  Sparkles,
  ChevronRight,
  Moon,
  Heart,
} from 'lucide-react';
import { HistoryView } from './HistoryView';

interface AdminDashboardProps {
  state: CareState;
  onUpdateSettings: (
    settings: Partial<CareSettings>,
    adminName?: string,
    friendName?: string,
    meals?: MealRecord[]
  ) => void;
  onSendNudge: (text: string, emoji: string) => void;
  onResetDay: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  state,
  onUpdateSettings,
  onSendNudge,
  onResetDay,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'history' | 'settings'>('status');
  const [customMsg, setCustomMsg] = useState('');
  const [breakfastTime, setBreakfastTime] = useState(
    state.meals.find((m) => m.id === 'breakfast')?.time || '08:00'
  );
  const [lunchTime, setLunchTime] = useState(
    state.meals.find((m) => m.id === 'lunch')?.time || '13:00'
  );
  const [dinnerTime, setDinnerTime] = useState(
    state.meals.find((m) => m.id === 'dinner')?.time || '20:00'
  );
  const [bedtime, setBedtime] = useState(state.sleep?.bedtime || '23:00');
  const [wakeTime, setWakeTime] = useState(state.sleep?.wakeTime || '07:00');
  const [adminNameInput, setAdminNameInput] = useState(state.adminName);
  const [friendNameInput, setFriendNameInput] = useState(state.friendName);
  const [savedAlert, setSavedAlert] = useState(false);

  const completedWater = state.waterSlots.filter((s) => s.status === 'completed').length;
  const totalWater = state.waterSlots.length;
  const sleepHours = state.sleep.hoursSlept || 0;

  const quickNudges = [
    { text: "Hey! Breakfast time 🐼 Have you eaten?", emoji: '🍳' },
    { text: "Don't forget your lunch 🙂", emoji: '🍛' },
    { text: "Time for some water 💧", emoji: '💧' },
    { text: "Hey buddy! Remember to get your 8 hours of sleep tonight 🐼🌙", emoji: '🌙' },
    { text: "Sending warm tea & cozy vibes 🍵🐼 Take it easy today!", emoji: '🍵' },
    { text: "Just checking in 🐼 Take care of yourself!", emoji: '🐼' },
  ];

  const handleSaveSettings = () => {
    const updatedMeals = state.meals.map((m) => {
      if (m.id === 'breakfast') return { ...m, time: breakfastTime };
      if (m.id === 'lunch') return { ...m, time: lunchTime };
      if (m.id === 'dinner') return { ...m, time: dinnerTime };
      return m;
    });

    onUpdateSettings(
      {
        breakfastTime,
        lunchTime,
        dinnerTime,
        bedtime,
        wakeTime,
        targetSleepHours: 8,
      },
      adminNameInput,
      friendNameInput,
      updatedMeals
    );

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const getMealStatusBadge = (meal?: MealRecord) => {
    if (!meal) return null;
    switch (meal.status) {
      case 'ate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 size={12} />
            <span>Ate {meal.completedAt ? `(${new Date(meal.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` : ''}</span>
          </span>
        );
      case 'not_eaten':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold">
            <XCircle size={12} />
            <span>Didn't eat</span>
          </span>
        );
      case 'waiting':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold animate-pulse">
            <AlertCircle size={12} />
            <span>Waiting for response</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-200 text-slate-600 text-xs font-medium">
            <Clock size={12} />
            <span>Upcoming ({meal.time})</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Tab Selector */}
      <div className="flex p-1 rounded-2xl bg-stone-200/80 border border-stone-300/80 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'status'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview & Nudges
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily History
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Schedules & Care
        </button>
      </div>

      {activeTab === 'status' && (
        <div className="space-y-4">
          {/* Friend Status Overview Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Best Friend Monitoring
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-800 font-display">
                  {state.friendName}'s Care Overview Today
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Last Active</span>
                <span className="text-xs font-bold text-slate-700 bg-stone-100 px-2.5 py-1 rounded-xl">
                  {state.lastActivityTime}
                </span>
              </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* 8h Sleep Status */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌙</span>
                  <div>
                    <div className="font-bold text-xs text-slate-800">8h Sleep Routine</div>
                    <div className="text-[11px] text-slate-500">
                      {state.sleep.quality ? `Quality: ${state.sleep.quality}` : 'Target 8h'}
                    </div>
                  </div>
                </div>
                <span className="font-extrabold text-xs px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-900">
                  {sleepHours} / 8.0 hrs
                </span>
              </div>

              {/* Period / Cycle Care Status */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌸</span>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Cycle Care</div>
                    <div className="text-[11px] text-slate-500">
                      {state.period.isPeriodActive ? 'Period Active 🍵' : `~${state.period.daysUntilNextPeriod}d to next`}
                    </div>
                  </div>
                </div>
                <span className="font-extrabold text-xs px-2.5 py-1 rounded-xl bg-rose-100 text-rose-900">
                  Day {state.period.currentCycleDay}
                </span>
              </div>

              {/* Breakfast */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🍳</span>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Breakfast</div>
                    <div className="text-[11px] text-slate-500">
                      Scheduled {state.meals.find((m) => m.id === 'breakfast')?.time || '08:00'}
                    </div>
                  </div>
                </div>
                {getMealStatusBadge(state.meals.find((m) => m.id === 'breakfast'))}
              </div>

              {/* Lunch */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🍛</span>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Lunch</div>
                    <div className="text-[11px] text-slate-500">
                      Scheduled {state.meals.find((m) => m.id === 'lunch')?.time || '13:00'}
                    </div>
                  </div>
                </div>
                {getMealStatusBadge(state.meals.find((m) => m.id === 'lunch'))}
              </div>

              {/* Dinner */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🍽️</span>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Dinner</div>
                    <div className="text-[11px] text-slate-500">
                      Scheduled {state.meals.find((m) => m.id === 'dinner')?.time || '20:00'}
                    </div>
                  </div>
                </div>
                {getMealStatusBadge(state.meals.find((m) => m.id === 'dinner'))}
              </div>

              {/* Water */}
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💧</span>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Water Today</div>
                    <div className="text-[11px] text-slate-500">2-hour intervals</div>
                  </div>
                </div>
                <span className="font-extrabold text-xs px-2.5 py-1 rounded-xl bg-sky-100 text-sky-800">
                  {completedWater} / {totalWater} completed
                </span>
              </div>
            </div>
          </div>

          {/* Quick Nudges */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-sm sm:text-base text-slate-800 font-display mb-1 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              <span>Send 1-Tap Best-Friend Reminders</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Gentle supportive check-ins matching our caring best-friend tone:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {quickNudges.map((nudge, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendNudge(nudge.text, nudge.emoji)}
                  className="p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/80 border border-stone-200/80 hover:border-emerald-200 text-left transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 pr-2">
                    <span className="text-lg">{nudge.emoji}</span>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-900">
                      {nudge.text}
                    </span>
                  </div>
                  <Send size={13} className="text-stone-400 group-hover:text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom Nudge Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={`Type a gentle reminder to ${state.friendName}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs focus:outline-emerald-500 text-slate-800 placeholder:text-slate-400"
              />
              <button
                disabled={!customMsg.trim()}
                onClick={() => {
                  if (customMsg.trim()) {
                    onSendNudge(customMsg.trim(), '🐼');
                    setCustomMsg('');
                  }
                }}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Send size={13} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && <HistoryView history={state.history} />}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-base text-slate-800 font-display">
                Schedule & Care Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure reminder hours, sleep routine, and partner names
              </p>
            </div>
            <SettingsIcon size={18} className="text-slate-400" />
          </div>

          {savedAlert && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 animate-in fade-in">
              ✅ Settings updated successfully!
            </div>
          )}

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Name (You)
              </label>
              <input
                type="text"
                value={adminNameInput}
                onChange={(e) => setAdminNameInput(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Friend's Name
              </label>
              <input
                type="text"
                value={friendNameInput}
                onChange={(e) => setFriendNameInput(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* Meal Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🍳 Breakfast Time
              </label>
              <input
                type="time"
                value={breakfastTime}
                onChange={(e) => setBreakfastTime(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🍛 Lunch Time
              </label>
              <input
                type="time"
                value={lunchTime}
                onChange={(e) => setLunchTime(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🍽️ Dinner Time
              </label>
              <input
                type="time"
                value={dinnerTime}
                onChange={(e) => setDinnerTime(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* 8 Hours Sleep Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🌙 Bedtime (Target 8h Sleep)
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ☀️ Wake-Up Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-slate-800 focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <button
              onClick={onResetDay}
              className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Reset Today</span>
            </button>

            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              Save Care Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
