import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { playGentleReminderChime } from '../utils/sound';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerTestMealReminder: () => void;
  onTriggerTestWaterReminder: () => void;
  onTriggerTestSleepReminder: () => void;
  onTriggerTestPeriodReminder: () => void;
  onTriggerTestNudge: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  onTriggerTestMealReminder,
  onTriggerTestWaterReminder,
  onTriggerTestSleepReminder,
  onTriggerTestPeriodReminder,
  onTriggerTestNudge,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermissionStatus(res);
        if (res === 'granted') {
          playGentleReminderChime(soundEnabled);
          new Notification('Daily Care 🐼', {
            body: "Hey! Best friend reminders are active. We'll check in on sleep, meals, water & cycle care!",
            icon: '/icon-192.png',
          });
        }
      } catch (err) {
        console.warn('Could not request notification permission:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg border border-emerald-200">
              🔔
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg font-display">
                Push Reminders & Chimes
              </h3>
              <p className="text-xs text-slate-500">
                PWA Web Push & gentle audio chimes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* System Permission Card */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Browser Push Notifications</span>
                {permissionStatus === 'granted' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {permissionStatus === 'granted'
                  ? 'Notifications are enabled for this device.'
                  : permissionStatus === 'denied'
                  ? 'Notifications are blocked in browser settings.'
                  : 'Enable reminders on your Android or iPhone.'}
              </p>
            </div>

            {permissionStatus !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-xs"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Sound toggle */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Volume2 size={18} className="text-slate-600" />
            <div>
              <div className="text-xs font-bold text-slate-800">
                Gentle Audio Chimes
              </div>
              <p className="text-xs text-slate-500">
                Play pleasant water droplets & friendly tones
              </p>
            </div>
          </div>
          <button
            onClick={onToggleSound}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
              soundEnabled ? 'bg-emerald-500' : 'bg-stone-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Test Notification Triggers */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
            <Sparkles size={13} className="text-amber-500" />
            <span>Test Reminders & Interactive Responses</span>
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Trigger real simulated notifications to test the 1-tap responses:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => {
                onTriggerTestMealReminder();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>🍳</span>
                <span>"Hey! It's breakfast time. Have you eaten?"</span>
              </div>
              <Play size={12} className="text-amber-700" />
            </button>

            <button
              onClick={() => {
                onTriggerTestWaterReminder();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100/80 text-sky-900 border border-sky-200 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>💧</span>
                <span>"Quick reminder: Have you had some water?"</span>
              </div>
              <Play size={12} className="text-sky-700" />
            </button>

            <button
              onClick={() => {
                onTriggerTestSleepReminder();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-900 border border-indigo-200 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>🌙</span>
                <span>"Time to wind down & get your 8 hours of sleep 🐼🌙"</span>
              </div>
              <Play size={12} className="text-indigo-700" />
            </button>

            <button
              onClick={() => {
                onTriggerTestPeriodReminder();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-rose-50/70 hover:bg-rose-100/80 text-rose-900 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>🌸</span>
                <span>"Cycle Care: Warm herbal tea & cozy relaxation 🍵"</span>
              </div>
              <Play size={12} className="text-rose-700" />
            </button>

            <button
              onClick={() => {
                onTriggerTestNudge();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>🐼</span>
                <span>"Just checking in 🐼 Take care of yourself!"</span>
              </div>
              <Play size={12} className="text-emerald-700" />
            </button>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
