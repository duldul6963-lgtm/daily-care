import {
  CareState,
  MealId,
  MealStatusType,
  WaterSlotStatusType,
  FriendCheckInMessage,
  CareSettings,
  SleepRecord,
  PeriodCycleRecord,
} from '../types';

const STORAGE_KEY = 'daily_care_best_friend_v3';
const broadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('daily_care_bf_sync') : null;

export function getFallbackState(): CareState {
  const today = new Date().toISOString().split('T')[0];
  return {
    date: today,
    adminName: 'Best Friend',
    friendName: 'Alex',
    lastActivityTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    meals: [
      { id: 'breakfast', name: 'Breakfast', emoji: '🍳', time: '08:00', status: 'waiting' },
      { id: 'lunch', name: 'Lunch', emoji: '🍛', time: '13:00', status: 'upcoming' },
      { id: 'dinner', name: 'Dinner', emoji: '🍽️', time: '20:00', status: 'upcoming' },
    ],
    waterSlots: [
      { id: 'w-0700', time: '07:00', targetMl: 250, status: 'waiting' },
      { id: 'w-0900', time: '09:00', targetMl: 250, status: 'waiting' },
      { id: 'w-1100', time: '11:00', targetMl: 250, status: 'upcoming' },
      { id: 'w-1300', time: '13:00', targetMl: 250, status: 'upcoming' },
      { id: 'w-1500', time: '15:00', targetMl: 250, status: 'upcoming' },
      { id: 'w-1700', time: '17:00', targetMl: 250, status: 'upcoming' },
      { id: 'w-1900', time: '19:00', targetMl: 250, status: 'upcoming' },
      { id: 'w-2100', time: '21:00', targetMl: 250, status: 'upcoming' },
    ],
    totalWaterDrunkMl: 0,
    dailyWaterGoalMl: 2000,
    sleep: {
      targetHours: 8,
      bedtime: '23:00',
      wakeTime: '07:00',
      hoursSlept: 8.0,
      quality: 'great',
      status: 'logged',
      loggedAt: new Date().toISOString(),
      notes: 'Woke up feeling well rested!',
    },
    period: {
      lastPeriodStartDate: '2026-08-10',
      cycleLengthDays: 28,
      periodDurationDays: 5,
      isPeriodActive: false,
      currentCycleDay: 10,
      daysUntilNextPeriod: 18,
      phase: 'follicular',
      symptoms: ['Normal Energy'],
      flow: 'medium',
      lastUpdated: new Date().toISOString(),
    },
    messages: [
      {
        id: 'msg-init-1',
        sender: 'admin',
        senderName: 'Best Friend',
        text: 'Hey buddy! 🐼 Made sure you had 8 hours of sleep, water, meals & cycle care today!',
        emoji: '🐼',
        createdAt: new Date().toISOString(),
      },
    ],
    history: [
      {
        date: '2026-08-18',
        formattedDate: '18 August',
        breakfast: 'ate',
        lunch: 'not_eaten',
        dinner: 'ate',
        waterCompletedCount: 6,
        waterTotalCount: 8,
        sleepHours: 8.0,
        sleepQuality: 'great',
        periodDay: 9,
        isPeriodActive: false,
        lastActivity: '8:45 PM',
      },
      {
        date: '2026-08-17',
        formattedDate: '17 August',
        breakfast: 'ate',
        lunch: 'ate',
        dinner: 'ate',
        waterCompletedCount: 7,
        waterTotalCount: 8,
        sleepHours: 7.5,
        sleepQuality: 'great',
        periodDay: 8,
        isPeriodActive: false,
        lastActivity: '9:15 PM',
      },
    ],
    settings: {
      breakfastTime: '08:00',
      lunchTime: '13:00',
      dinnerTime: '20:00',
      bedtime: '23:00',
      wakeTime: '07:00',
      targetSleepHours: 8,
      waterIntervalHours: 2,
      waterStartHour: 7,
      waterEndHour: 22,
      cycleLengthDays: 28,
      periodDurationDays: 5,
      notificationsEnabled: true,
      soundEnabled: true,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function loadLocalState(): CareState {
  if (typeof window === 'undefined') return getFallbackState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const today = new Date().toISOString().split('T')[0];
      if (parsed.date === today && parsed.sleep && parsed.period) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load local state:', err);
  }
  return getFallbackState();
}

export function saveLocalState(state: CareState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    broadcast?.postMessage({ type: 'STATE_UPDATED', state });
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export async function fetchServerState(): Promise<CareState> {
  try {
    const res = await fetch('/api/care/state');
    if (res.ok) {
      const data: CareState = await res.json();
      saveLocalState(data);
      return data;
    }
  } catch (err) {
    console.warn('Backend unavailable, using cached local data:', err);
  }
  return loadLocalState();
}

export async function updateMealApi(
  mealId: MealId,
  status: MealStatusType,
  notes?: string
): Promise<{ state: CareState; isOffline?: boolean }> {
  try {
    const res = await fetch('/api/care/meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealId, status, notes }),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalState(data.state);
      return { state: data.state, isOffline: false };
    }
  } catch {
    // Offline fallback
  }

  const state = loadLocalState();
  const meal = state.meals.find((m) => m.id === mealId);
  if (meal) {
    meal.status = status;
    meal.completedAt = status === 'ate' ? new Date().toISOString() : undefined;
    if (notes !== undefined) meal.notes = notes;
    state.lastActivityTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.lastUpdated = new Date().toISOString();
    saveLocalState(state);
  }
  return { state, isOffline: true };
}

export async function updateWaterApi(
  slotId?: string,
  status?: WaterSlotStatusType,
  amountMl?: number
): Promise<{ state: CareState; isOffline?: boolean }> {
  try {
    const res = await fetch('/api/care/water', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId, status, amountMl }),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalState(data.state);
      return { state: data.state, isOffline: false };
    }
  } catch {
    // Offline
  }

  const state = loadLocalState();
  if (slotId && status) {
    const slot = state.waterSlots.find((s) => s.id === slotId);
    if (slot) {
      const wasDone = slot.status === 'completed';
      slot.status = status;
      slot.completedAt = status === 'completed' ? new Date().toISOString() : undefined;
      if (status === 'completed' && !wasDone) {
        state.totalWaterDrunkMl += slot.targetMl;
      } else if (status !== 'completed' && wasDone) {
        state.totalWaterDrunkMl = Math.max(0, state.totalWaterDrunkMl - slot.targetMl);
      }
    }
  } else if (amountMl) {
    state.totalWaterDrunkMl += amountMl;
    const nextPending = state.waterSlots.find((s) => s.status === 'waiting' || s.status === 'upcoming');
    if (nextPending) {
      nextPending.status = 'completed';
      nextPending.completedAt = new Date().toISOString();
    }
  }
  state.lastActivityTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.lastUpdated = new Date().toISOString();
  saveLocalState(state);
  return { state, isOffline: true };
}

export async function updateSleepApi(params: {
  hoursSlept?: number;
  quality?: 'great' | 'okay' | 'tired';
  notes?: string;
  bedtime?: string;
  wakeTime?: string;
}): Promise<{ state: CareState; isOffline?: boolean }> {
  try {
    const res = await fetch('/api/care/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalState(data.state);
      return { state: data.state, isOffline: false };
    }
  } catch {
    // Offline
  }

  const state = loadLocalState();
  if (params.hoursSlept !== undefined) state.sleep.hoursSlept = params.hoursSlept;
  if (params.quality) state.sleep.quality = params.quality;
  if (params.notes !== undefined) state.sleep.notes = params.notes;
  if (params.bedtime) state.sleep.bedtime = params.bedtime;
  if (params.wakeTime) state.sleep.wakeTime = params.wakeTime;
  state.sleep.status = 'logged';
  state.sleep.loggedAt = new Date().toISOString();
  state.lastActivityTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.lastUpdated = new Date().toISOString();
  saveLocalState(state);
  return { state, isOffline: true };
}

export async function updatePeriodApi(params: {
  lastPeriodStartDate?: string;
  cycleLengthDays?: number;
  periodDurationDays?: number;
  symptoms?: string[];
  flow?: 'light' | 'medium' | 'heavy';
  isPeriodActive?: boolean;
}): Promise<{ state: CareState; isOffline?: boolean }> {
  try {
    const res = await fetch('/api/care/period', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalState(data.state);
      return { state: data.state, isOffline: false };
    }
  } catch {
    // Offline
  }

  const state = loadLocalState();
  if (params.lastPeriodStartDate) state.period.lastPeriodStartDate = params.lastPeriodStartDate;
  if (params.cycleLengthDays) state.period.cycleLengthDays = params.cycleLengthDays;
  if (params.periodDurationDays) state.period.periodDurationDays = params.periodDurationDays;
  if (params.symptoms) state.period.symptoms = params.symptoms;
  if (params.flow) state.period.flow = params.flow;
  if (params.isPeriodActive !== undefined) state.period.isPeriodActive = params.isPeriodActive;

  state.period.lastUpdated = new Date().toISOString();
  state.lastActivityTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.lastUpdated = new Date().toISOString();
  saveLocalState(state);
  return { state, isOffline: true };
}

export async function sendNoteApi(
  sender: 'admin' | 'friend',
  senderName: string,
  text: string,
  emoji = '🐼'
): Promise<CareState> {
  try {
    const res = await fetch('/api/care/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, senderName, text, emoji }),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalState(data.state);
      return data.state;
    }
  } catch {
    // Offline
  }

  const state = loadLocalState();
  const newMsg: FriendCheckInMessage = {
    id: `msg-${Date.now()}`,
    sender,
    senderName,
    text,
    emoji,
    createdAt: new Date().toISOString(),
  };
  state.messages.unshift(newMsg);
  state.lastActivityTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.lastUpdated = new Date().toISOString();
  saveLocalState(state);
  return state;
}

export async function updateSettingsApi(
  settings: Partial<CareSettings>,
  adminName?: string,
  friendName?: string,
  meals?: any[]
): Promise<CareState> {
  try {
    const res = await fetch('/api/care/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings, adminName, friendName, meals }),
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalState(data.state);
      return data.state;
    }
  } catch {
    // Offline
  }

  const state = loadLocalState();
  if (adminName) state.adminName = adminName;
  if (friendName) state.friendName = friendName;
  if (settings) {
    state.settings = { ...state.settings, ...settings };
    if (settings.targetSleepHours) state.sleep.targetHours = settings.targetSleepHours;
    if (settings.bedtime) state.sleep.bedtime = settings.bedtime;
    if (settings.wakeTime) state.sleep.wakeTime = settings.wakeTime;
  }
  if (meals) state.meals = meals;
  state.lastUpdated = new Date().toISOString();
  saveLocalState(state);
  return state;
}

export async function resetDayApi(): Promise<CareState> {
  try {
    const res = await fetch('/api/care/reset', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      saveLocalState(data.state);
      return data.state;
    }
  } catch {
    //
  }
  const fresh = getFallbackState();
  saveLocalState(fresh);
  return fresh;
}

export function subscribeToSyncEvents(onUpdate: (state: CareState) => void): () => void {
  const handleBroadcast = (e: MessageEvent) => {
    if (e.data?.type === 'STATE_UPDATED' && e.data.state) {
      onUpdate(e.data.state);
    }
  };
  broadcast?.addEventListener('message', handleBroadcast);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        onUpdate(parsed);
      } catch {
        //
      }
    }
  };
  window.addEventListener('storage', handleStorage);

  let eventSource: EventSource | null = null;
  try {
    eventSource = new EventSource('/api/care/events');
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        saveLocalState(data);
        onUpdate(data);
      } catch {
        //
      }
    };
  } catch {
    //
  }

  return () => {
    broadcast?.removeEventListener('message', handleBroadcast);
    window.removeEventListener('storage', handleStorage);
    eventSource?.close();
  };
}
