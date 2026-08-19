import React, { useState, useEffect, useCallback } from 'react';
import { CareState, UserRole, MealId, MealStatusType, WaterSlotStatusType, CareSettings, MealRecord } from './types';
import {
  fetchServerState,
  loadLocalState,
  saveLocalState,
  updateMealApi,
  updateWaterApi,
  updateSleepApi,
  updatePeriodApi,
  sendNoteApi,
  updateSettingsApi,
  resetDayApi,
  subscribeToSyncEvents,
} from './utils/storage';
import {
  playDropletSound,
  playMealChime,
  playGentleReminderChime,
} from './utils/sound';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { FriendDashboard } from './components/FriendDashboard';
import { MealTracker } from './components/MealTracker';
import { WaterTracker } from './components/WaterTracker';
import { SleepTracker } from './components/SleepTracker';
import { PeriodCycleCare } from './components/PeriodCycleCare';
import { FriendNotesWall } from './components/FriendNotesWall';
import { LiveNotificationToast, ActiveReminder } from './components/LiveNotificationToast';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { Smartphone, Bell, Moon, Heart } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<CareState>(loadLocalState);
  const [role, setRole] = useState<UserRole>('friend');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showOfflineSyncBanner, setShowOfflineSyncBanner] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [activeReminder, setActiveReminder] = useState<ActiveReminder | null>(null);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchServerState().then((s) => s && setState(s));
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register PWA Service Worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration skipped:', err);
      });
    }
  }, []);

  // Fetch initial server state & subscribe to real-time events
  useEffect(() => {
    fetchServerState().then((serverState) => {
      if (serverState) setState(serverState);
    });

    const unsubscribe = subscribeToSyncEvents((updatedState) => {
      setState(updatedState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sound settings
  useEffect(() => {
    if (state.settings?.soundEnabled !== undefined) {
      setSoundEnabled(state.settings.soundEnabled);
    }
  }, [state.settings?.soundEnabled]);

  const triggerNotification = useCallback(
    (reminder: ActiveReminder) => {
      setActiveReminder(reminder);
      playGentleReminderChime(soundEnabled);

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`Daily Care 🐼: ${reminder.title}`, {
            body: reminder.message,
            icon: '/icon-192.png',
          });
        } catch {
          //
        }
      }
    },
    [soundEnabled]
  );

  // Periodic Reminder Checker (checks schedule against current time)
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const timeString = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;

      // Check meals waiting for response
      state.meals.forEach((meal) => {
        if (meal.status === 'waiting' && meal.time === timeString) {
          triggerNotification({
            id: `meal-${meal.id}-${Date.now()}`,
            type: 'meal',
            title: `${meal.name} Reminder`,
            message: `Hey! It's ${meal.name.toLowerCase()} time. Have you eaten? 🐼`,
            mealId: meal.id,
            emoji: meal.emoji,
          });
        }
      });

      // Check 2-hour water intervals (7 AM to 10 PM)
      if (currentMinutes === 0 && currentHours >= 7 && currentHours <= 22 && currentHours % 2 === 1) {
        const slot = state.waterSlots.find((s) => s.time.startsWith(String(currentHours).padStart(2, '0')));
        if (slot && slot.status === 'waiting') {
          triggerNotification({
            id: `water-${slot.id}-${Date.now()}`,
            type: 'water',
            title: 'Water Reminder',
            message: 'Quick reminder: Have you had some water? 💧🐼',
            slotId: slot.id,
            emoji: '💧',
          });
        }
      }

      // Check Bedtime reminder (e.g. 23:00)
      if (state.sleep?.bedtime === timeString) {
        triggerNotification({
          id: `sleep-${Date.now()}`,
          type: 'sleep',
          title: '8 Hours Sleep Routine',
          message: 'Hey buddy! Time to wind down and get your 8 hours of sleep 🐼🌙',
          emoji: '🌙',
        });
      }
    };

    const timer = setInterval(checkSchedule, 30000);
    return () => clearInterval(timer);
  }, [state.meals, state.waterSlots, state.sleep, triggerNotification]);

  // Meal response handlers
  const handleUpdateMeal = async (mealId: MealId, status: MealStatusType, notes?: string) => {
    const { state: updated, isOffline } = await updateMealApi(mealId, status, notes);
    setState(updated);
    if (isOffline) {
      setShowOfflineSyncBanner(true);
      setTimeout(() => setShowOfflineSyncBanner(false), 4000);
    }
    if (activeReminder?.mealId === mealId) {
      setActiveReminder(null);
    }
  };

  // Water response handlers
  const handleUpdateWaterSlot = async (slotId: string, status: WaterSlotStatusType) => {
    const { state: updated, isOffline } = await updateWaterApi(slotId, status);
    setState(updated);
    if (isOffline) {
      setShowOfflineSyncBanner(true);
      setTimeout(() => setShowOfflineSyncBanner(false), 4000);
    }
    if (activeReminder?.slotId === slotId) {
      setActiveReminder(null);
    }
  };

  const handleAddManualWater = async (amountMl: number) => {
    const { state: updated } = await updateWaterApi(undefined, undefined, amountMl);
    setState(updated);
  };

  // Sleep update handler
  const handleUpdateSleep = async (params: {
    hoursSlept?: number;
    quality?: 'great' | 'okay' | 'tired';
    notes?: string;
  }) => {
    const { state: updated } = await updateSleepApi(params);
    setState(updated);
  };

  // Period / Cycle update handler
  const handleUpdatePeriod = async (params: {
    lastPeriodStartDate?: string;
    cycleLengthDays?: number;
    periodDurationDays?: number;
    symptoms?: string[];
    flow?: 'light' | 'medium' | 'heavy';
    isPeriodActive?: boolean;
  }) => {
    const { state: updated } = await updatePeriodApi(params);
    setState(updated);
  };

  // Best-friend Check-in Notes
  const handleSendMessage = async (text: string, emoji = '🐼') => {
    const senderName = role === 'admin' ? state.adminName : state.friendName;
    const updated = await sendNoteApi(role, senderName, text, emoji);
    setState(updated);
  };

  const handleSendNudge = (text: string, emoji: string) => {
    handleSendMessage(text, emoji);
    triggerNotification({
      id: `nudge-${Date.now()}`,
      type: 'nudge',
      title: 'Best Friend Check-In',
      message: text,
      emoji,
    });
  };

  const handleUpdateSettings = async (
    settings: Partial<CareSettings>,
    adminName?: string,
    friendName?: string,
    meals?: MealRecord[]
  ) => {
    const updated = await updateSettingsApi(settings, adminName, friendName, meals);
    setState(updated);
  };

  const handleResetDay = async () => {
    const fresh = await resetDayApi();
    setState(fresh);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playDropletSound(true);
    handleUpdateSettings({ soundEnabled: next });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col text-slate-800">
      {/* Navigation Header */}
      <Navbar
        currentRole={role}
        onRoleChange={(newRole) => {
          playDropletSound(soundEnabled);
          setRole(newRole);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        adminName={state.adminName}
        friendName={state.friendName}
        isOnline={isOnline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 sm:py-6 space-y-5 sm:space-y-6">
        {/* Offline Sync Status Notification Banner */}
        {showOfflineSyncBanner && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">🐼</span>
              <span className="font-semibold">
                Saved. We'll sync when you're back online. 🐼
              </span>
            </div>
            <button
              onClick={() => setShowOfflineSyncBanner(false)}
              className="text-amber-700 hover:text-amber-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Role Switcher Pill Bar */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 rounded-2xl bg-stone-100/90 border border-stone-200 text-xs">
          <div className="flex items-center gap-2">
            <span>{role === 'admin' ? '🛡️' : '🐼'}</span>
            <span className="font-medium text-slate-600">
              Active Mode:{' '}
              <strong className="text-slate-800">
                {role === 'admin' ? `Admin (${state.adminName})` : `Friend (${state.friendName})`}
              </strong>
            </span>
          </div>

          <button
            onClick={() => {
              playDropletSound(soundEnabled);
              setRole(role === 'admin' ? 'friend' : 'admin');
            }}
            className="font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
          >
            <span>Switch to {role === 'admin' ? 'Friend 🐼' : 'Admin 🛡️'}</span>
          </button>
        </div>

        {/* Main Dashboard depending on role */}
        {role === 'admin' ? (
          <AdminDashboard
            state={state}
            onUpdateSettings={handleUpdateSettings}
            onSendNudge={handleSendNudge}
            onResetDay={handleResetDay}
          />
        ) : (
          <FriendDashboard
            state={state}
            soundEnabled={soundEnabled}
            onQuickDrinkWater={() => handleAddManualWater(250)}
            onQuickLogMeal={(mealId) => handleUpdateMeal(mealId, 'ate')}
            onQuickLogSleep={() => handleUpdateSleep({ hoursSlept: 8, quality: 'great' })}
          />
        )}

        {/* 1. 8 Hours Sleep Tracker */}
        <SleepTracker
          sleep={state.sleep}
          role={role}
          soundEnabled={soundEnabled}
          onUpdateSleep={handleUpdateSleep}
          onSendNudge={handleSendNudge}
        />

        {/* 2. Period Timing & Cycle Care */}
        <PeriodCycleCare
          period={state.period}
          role={role}
          soundEnabled={soundEnabled}
          onUpdatePeriod={handleUpdatePeriod}
          onSendNudge={handleSendNudge}
        />

        {/* 3. Meal Tracker */}
        <MealTracker
          meals={state.meals}
          role={role}
          soundEnabled={soundEnabled}
          onUpdateMeal={handleUpdateMeal}
          onSendNudge={handleSendNudge}
        />

        {/* 4. Water Tracker (2-hourly from 7 AM to 10 PM) */}
        <WaterTracker
          waterSlots={state.waterSlots}
          totalDrunkMl={state.totalWaterDrunkMl}
          dailyGoalMl={state.dailyWaterGoalMl}
          role={role}
          soundEnabled={soundEnabled}
          onUpdateSlot={handleUpdateWaterSlot}
          onAddManualWater={handleAddManualWater}
          onSendNudge={handleSendNudge}
        />

        {/* 5. Best Friend Check-In Wall */}
        <FriendNotesWall
          messages={state.messages}
          role={role}
          adminName={state.adminName}
          friendName={state.friendName}
          soundEnabled={soundEnabled}
          onSendMessage={handleSendMessage}
        />
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center border-t border-stone-200/70 text-xs text-slate-400">
        <div className="max-w-md mx-auto flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span>Daily Care 🐼</span>
            <span>•</span>
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Smartphone size={13} />
              <span>Install to Phone</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Bell size={13} />
              <span>Notification Test</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            A gentle best-friend care app for 8h sleep, period timing, meals & water reminders.
          </p>
        </div>
      </footer>

      {/* Live Interactive Notification Toast */}
      <LiveNotificationToast
        reminder={activeReminder}
        onAcknowledgeMeal={(mealId, status) => handleUpdateMeal(mealId, status)}
        onAcknowledgeWater={(slotId, status) => {
          if (slotId && status) {
            handleUpdateWaterSlot(slotId, status);
          } else {
            handleAddManualWater(250);
          }
          setActiveReminder(null);
        }}
        onAcknowledgeSleep={(hours, quality) => {
          handleUpdateSleep({ hoursSlept: hours, quality });
          setActiveReminder(null);
        }}
        onAcknowledgePeriod={(comfortAction) => {
          handleSendMessage(`Taking care: ${comfortAction}`, '🍵');
          setActiveReminder(null);
        }}
        onDismiss={() => setActiveReminder(null)}
      />

      {/* PWA Install Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

      {/* Push Notification Settings & Tester Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onTriggerTestMealReminder={() => {
          triggerNotification({
            id: `test-breakfast-${Date.now()}`,
            type: 'meal',
            title: 'Breakfast Reminder',
            message: "Hey! It's breakfast time. Have you eaten? 🐼",
            mealId: 'breakfast',
            emoji: '🍳',
          });
        }}
        onTriggerTestWaterReminder={() => {
          triggerNotification({
            id: `test-water-${Date.now()}`,
            type: 'water',
            title: 'Water Reminder',
            message: 'Quick reminder: Have you had some water? 💧🐼',
            slotId: 'w-0900',
            emoji: '💧',
          });
        }}
        onTriggerTestSleepReminder={() => {
          triggerNotification({
            id: `test-sleep-${Date.now()}`,
            type: 'sleep',
            title: '8 Hours Sleep Routine',
            message: 'Time to wind down & get your 8 hours of sleep 🐼🌙',
            emoji: '🌙',
          });
        }}
        onTriggerTestPeriodReminder={() => {
          triggerNotification({
            id: `test-period-${Date.now()}`,
            type: 'period',
            title: 'Period & Cycle Care',
            message: 'Cycle Care: Warm herbal tea & cozy relaxation 🍵',
            emoji: '🌸',
          });
        }}
        onTriggerTestNudge={() => {
          triggerNotification({
            id: `test-nudge-${Date.now()}`,
            type: 'nudge',
            title: 'Best Friend Check-In',
            message: 'Just checking in 🐼 Take care of yourself!',
            emoji: '🐼',
          });
        }}
      />
    </div>
  );
}
