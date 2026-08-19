import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface MealRecord {
  id: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  emoji: string;
  time: string;
  status: 'ate' | 'not_eaten' | 'waiting' | 'upcoming';
  completedAt?: string;
  notes?: string;
}

interface WaterSlotRecord {
  id: string;
  time: string;
  targetMl: number;
  status: 'completed' | 'not_yet' | 'waiting' | 'upcoming';
  completedAt?: string;
}

interface SleepRecord {
  targetHours: number;
  bedtime: string;
  wakeTime: string;
  hoursSlept?: number;
  quality?: 'great' | 'okay' | 'tired';
  status: 'logged' | 'waiting' | 'upcoming';
  loggedAt?: string;
  notes?: string;
}

interface PeriodCycleRecord {
  lastPeriodStartDate: string;
  cycleLengthDays: number;
  periodDurationDays: number;
  isPeriodActive: boolean;
  currentCycleDay: number;
  daysUntilNextPeriod: number;
  phase: 'period' | 'follicular' | 'ovulation' | 'luteal';
  symptoms: string[];
  flow?: 'light' | 'medium' | 'heavy';
  lastUpdated?: string;
}

interface FriendCheckInMessage {
  id: string;
  sender: 'admin' | 'friend';
  senderName: string;
  text: string;
  emoji: string;
  createdAt: string;
}

interface DayHistoryRecord {
  date: string;
  formattedDate: string;
  breakfast: 'ate' | 'not_eaten' | 'waiting' | 'upcoming';
  lunch: 'ate' | 'not_eaten' | 'waiting' | 'upcoming';
  dinner: 'ate' | 'not_eaten' | 'waiting' | 'upcoming';
  waterCompletedCount: number;
  waterTotalCount: number;
  sleepHours?: number;
  sleepQuality?: 'great' | 'okay' | 'tired';
  periodDay?: number;
  isPeriodActive?: boolean;
  lastActivity?: string;
}

interface CareState {
  date: string;
  adminName: string;
  friendName: string;
  lastActivityTime: string;
  meals: MealRecord[];
  waterSlots: WaterSlotRecord[];
  totalWaterDrunkMl: number;
  dailyWaterGoalMl: number;
  sleep: SleepRecord;
  period: PeriodCycleRecord;
  messages: FriendCheckInMessage[];
  history: DayHistoryRecord[];
  settings: {
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    bedtime: string;
    wakeTime: string;
    targetSleepHours: number;
    waterIntervalHours: number;
    waterStartHour: number;
    waterEndHour: number;
    cycleLengthDays: number;
    periodDurationDays: number;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
  };
  lastUpdated: string;
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function formatDayLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  } catch {
    return dateStr;
  }
}

function calculateCycleInfo(
  lastPeriodStartDate: string,
  cycleLength = 28,
  periodDuration = 5
): {
  currentCycleDay: number;
  daysUntilNextPeriod: number;
  phase: 'period' | 'follicular' | 'ovulation' | 'luteal';
  isPeriodActive: boolean;
} {
  const today = new Date();
  const start = new Date(lastPeriodStartDate + 'T00:00:00');
  const diffTime = Math.max(0, today.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const currentCycleDay = (diffDays % cycleLength) + 1;
  const daysUntilNextPeriod = cycleLength - currentCycleDay;
  const isPeriodActive = currentCycleDay <= periodDuration;

  let phase: 'period' | 'follicular' | 'ovulation' | 'luteal' = 'follicular';
  if (isPeriodActive) {
    phase = 'period';
  } else if (currentCycleDay <= 12) {
    phase = 'follicular';
  } else if (currentCycleDay >= 13 && currentCycleDay <= 16) {
    phase = 'ovulation';
  } else {
    phase = 'luteal';
  }

  return { currentCycleDay, daysUntilNextPeriod, phase, isPeriodActive };
}

function generateInitialHistory(): DayHistoryRecord[] {
  const history: DayHistoryRecord[] = [];
  const today = new Date();

  // Yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];
  history.push({
    date: yStr,
    formattedDate: formatDayLabel(yStr),
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
  });

  // 2 days ago
  const d2 = new Date(today);
  d2.setDate(today.getDate() - 2);
  const d2Str = d2.toISOString().split('T')[0];
  history.push({
    date: d2Str,
    formattedDate: formatDayLabel(d2Str),
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
  });

  // 3 days ago
  const d3 = new Date(today);
  d3.setDate(today.getDate() - 3);
  const d3Str = d3.toISOString().split('T')[0];
  history.push({
    date: d3Str,
    formattedDate: formatDayLabel(d3Str),
    breakfast: 'ate',
    lunch: 'ate',
    dinner: 'not_eaten',
    waterCompletedCount: 5,
    waterTotalCount: 8,
    sleepHours: 6.5,
    sleepQuality: 'tired',
    periodDay: 7,
    isPeriodActive: false,
    lastActivity: '7:30 PM',
  });

  return history;
}

function calculateSlotStatus(timeStr: string): 'waiting' | 'upcoming' {
  const [slotH, slotM] = timeStr.split(':').map(Number);
  const now = new Date();
  const currentH = now.getHours();
  const currentM = now.getMinutes();

  if (currentH > slotH || (currentH === slotH && currentM >= slotM)) {
    return 'waiting';
  }
  return 'upcoming';
}

function createInitialState(dateStr = getTodayDateString()): CareState {
  const lastPeriodStart = '2026-08-10'; // 9-10 days ago
  const cycleInfo = calculateCycleInfo(lastPeriodStart, 28, 5);

  const waterSlots: WaterSlotRecord[] = [
    { id: 'w-0700', time: '07:00', targetMl: 250, status: calculateSlotStatus('07:00') },
    { id: 'w-0900', time: '09:00', targetMl: 250, status: calculateSlotStatus('09:00') },
    { id: 'w-1100', time: '11:00', targetMl: 250, status: calculateSlotStatus('11:00') },
    { id: 'w-1300', time: '13:00', targetMl: 250, status: calculateSlotStatus('13:00') },
    { id: 'w-1500', time: '15:00', targetMl: 250, status: calculateSlotStatus('15:00') },
    { id: 'w-1700', time: '17:00', targetMl: 250, status: calculateSlotStatus('17:00') },
    { id: 'w-1900', time: '19:00', targetMl: 250, status: calculateSlotStatus('19:00') },
    { id: 'w-2100', time: '21:00', targetMl: 250, status: calculateSlotStatus('21:00') },
  ];

  return {
    date: dateStr,
    adminName: 'Best Friend',
    friendName: 'Alex',
    lastActivityTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    meals: [
      { id: 'breakfast', name: 'Breakfast', emoji: '🍳', time: '08:00', status: calculateSlotStatus('08:00') },
      { id: 'lunch', name: 'Lunch', emoji: '🍛', time: '13:00', status: calculateSlotStatus('13:00') },
      { id: 'dinner', name: 'Dinner', emoji: '🍽️', time: '20:00', status: calculateSlotStatus('20:00') },
    ],
    waterSlots,
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
      lastPeriodStartDate: lastPeriodStart,
      cycleLengthDays: 28,
      periodDurationDays: 5,
      isPeriodActive: cycleInfo.isPeriodActive,
      currentCycleDay: cycleInfo.currentCycleDay,
      daysUntilNextPeriod: cycleInfo.daysUntilNextPeriod,
      phase: cycleInfo.phase,
      symptoms: ['Normal Energy', 'Feeling Good'],
      flow: 'medium',
      lastUpdated: new Date().toISOString(),
    },
    messages: [
      {
        id: 'msg-init-1',
        sender: 'admin',
        senderName: 'Best Friend',
        text: 'Hey buddy! 🐼 Made sure you had 8 hours of sleep, breakfast, water & cozy cycle care today!',
        emoji: '🐼',
        createdAt: new Date().toISOString(),
      },
    ],
    history: generateInitialHistory(),
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

let currentState: CareState = createInitialState();
const sseClients: express.Response[] = [];

function notifyClients() {
  const data = JSON.stringify(currentState);
  sseClients.forEach((res) => {
    try {
      res.write(`data: ${data}\n\n`);
    } catch {
      //
    }
  });
}

function updateLastActivity() {
  currentState.lastActivityTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  currentState.lastUpdated = new Date().toISOString();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Get current state
  app.get('/api/care/state', (req, res) => {
    const today = getTodayDateString();
    if (currentState.date !== today) {
      // Archive previous day to history
      const completedWater = currentState.waterSlots.filter((s) => s.status === 'completed').length;
      currentState.history.unshift({
        date: currentState.date,
        formattedDate: formatDayLabel(currentState.date),
        breakfast: currentState.meals.find((m) => m.id === 'breakfast')?.status || 'waiting',
        lunch: currentState.meals.find((m) => m.id === 'lunch')?.status || 'waiting',
        dinner: currentState.meals.find((m) => m.id === 'dinner')?.status || 'waiting',
        waterCompletedCount: completedWater,
        waterTotalCount: currentState.waterSlots.length,
        sleepHours: currentState.sleep.hoursSlept,
        sleepQuality: currentState.sleep.quality,
        periodDay: currentState.period.currentCycleDay,
        isPeriodActive: currentState.period.isPeriodActive,
        lastActivity: currentState.lastActivityTime,
      });

      const newDay = createInitialState(today);
      newDay.history = currentState.history;
      newDay.adminName = currentState.adminName;
      newDay.friendName = currentState.friendName;
      newDay.settings = currentState.settings;
      newDay.period = currentState.period;
      currentState = newDay;
    }
    res.json(currentState);
  });

  // SSE stream
  app.get('/api/care/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.push(res);
    res.write(`data: ${JSON.stringify(currentState)}\n\n`);

    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  // Update meal response
  app.post('/api/care/meal', (req, res) => {
    const { mealId, status, notes } = req.body;
    const meal = currentState.meals.find((m) => m.id === mealId);
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    meal.status = status;
    meal.completedAt = status === 'ate' ? new Date().toISOString() : undefined;
    if (notes !== undefined) meal.notes = notes;

    updateLastActivity();
    notifyClients();
    res.json({ success: true, state: currentState });
  });

  // Update water slot response
  app.post('/api/care/water', (req, res) => {
    const { slotId, status, amountMl } = req.body;
    if (slotId) {
      const slot = currentState.waterSlots.find((s) => s.id === slotId);
      if (slot) {
        const wasDone = slot.status === 'completed';
        slot.status = status;
        slot.completedAt = status === 'completed' ? new Date().toISOString() : undefined;

        if (status === 'completed' && !wasDone) {
          currentState.totalWaterDrunkMl += slot.targetMl;
        } else if (status !== 'completed' && wasDone) {
          currentState.totalWaterDrunkMl = Math.max(0, currentState.totalWaterDrunkMl - slot.targetMl);
        }
      }
    } else if (amountMl) {
      currentState.totalWaterDrunkMl += Number(amountMl);
      const nextPending = currentState.waterSlots.find((s) => s.status === 'waiting' || s.status === 'upcoming');
      if (nextPending) {
        nextPending.status = 'completed';
        nextPending.completedAt = new Date().toISOString();
      }
    }

    updateLastActivity();
    notifyClients();
    res.json({ success: true, state: currentState });
  });

  // Update 8-hour sleep log
  app.post('/api/care/sleep', (req, res) => {
    const { hoursSlept, quality, notes, bedtime, wakeTime } = req.body;
    if (hoursSlept !== undefined) currentState.sleep.hoursSlept = Number(hoursSlept);
    if (quality) currentState.sleep.quality = quality;
    if (notes !== undefined) currentState.sleep.notes = notes;
    if (bedtime) currentState.sleep.bedtime = bedtime;
    if (wakeTime) currentState.sleep.wakeTime = wakeTime;
    currentState.sleep.status = 'logged';
    currentState.sleep.loggedAt = new Date().toISOString();

    updateLastActivity();
    notifyClients();
    res.json({ success: true, state: currentState });
  });

  // Update Period & Cycle Care
  app.post('/api/care/period', (req, res) => {
    const { lastPeriodStartDate, cycleLengthDays, periodDurationDays, symptoms, flow, isPeriodActive } = req.body;
    if (lastPeriodStartDate) currentState.period.lastPeriodStartDate = lastPeriodStartDate;
    if (cycleLengthDays) currentState.period.cycleLengthDays = Number(cycleLengthDays);
    if (periodDurationDays) currentState.period.periodDurationDays = Number(periodDurationDays);
    if (symptoms && Array.isArray(symptoms)) currentState.period.symptoms = symptoms;
    if (flow) currentState.period.flow = flow;

    const recalculated = calculateCycleInfo(
      currentState.period.lastPeriodStartDate,
      currentState.period.cycleLengthDays,
      currentState.period.periodDurationDays
    );

    currentState.period.currentCycleDay = recalculated.currentCycleDay;
    currentState.period.daysUntilNextPeriod = recalculated.daysUntilNextPeriod;
    currentState.period.phase = recalculated.phase;
    currentState.period.isPeriodActive = isPeriodActive !== undefined ? isPeriodActive : recalculated.isPeriodActive;
    currentState.period.lastUpdated = new Date().toISOString();

    updateLastActivity();
    notifyClients();
    res.json({ success: true, state: currentState });
  });

  // Send friendly check-in note
  app.post('/api/care/note', (req, res) => {
    const { sender, senderName, text, emoji } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text required' });
    }

    const newMsg: FriendCheckInMessage = {
      id: `msg-${Date.now()}`,
      sender: sender || 'admin',
      senderName: senderName || (sender === 'admin' ? currentState.adminName : currentState.friendName),
      text: text.trim(),
      emoji: emoji || '🐼',
      createdAt: new Date().toISOString(),
    };

    currentState.messages.unshift(newMsg);
    updateLastActivity();
    notifyClients();
    res.json({ success: true, message: newMsg, state: currentState });
  });

  // Update Schedules & Settings
  app.post('/api/care/settings', (req, res) => {
    const { adminName, friendName, settings, meals } = req.body;
    if (adminName) currentState.adminName = adminName;
    if (friendName) currentState.friendName = friendName;
    if (settings) {
      currentState.settings = { ...currentState.settings, ...settings };
      if (settings.targetSleepHours) currentState.sleep.targetHours = settings.targetSleepHours;
      if (settings.bedtime) currentState.sleep.bedtime = settings.bedtime;
      if (settings.wakeTime) currentState.sleep.wakeTime = settings.wakeTime;
      if (settings.cycleLengthDays) currentState.period.cycleLengthDays = settings.cycleLengthDays;
      if (settings.periodDurationDays) currentState.period.periodDurationDays = settings.periodDurationDays;
    }
    if (meals && Array.isArray(meals)) {
      meals.forEach((m) => {
        const target = currentState.meals.find((tm) => tm.id === m.id);
        if (target) {
          if (m.time) target.time = m.time;
          if (m.name) target.name = m.name;
        }
      });
    }

    updateLastActivity();
    notifyClients();
    res.json({ success: true, state: currentState });
  });

  // Reset Today
  app.post('/api/care/reset', (req, res) => {
    const fresh = createInitialState();
    fresh.history = currentState.history;
    fresh.adminName = currentState.adminName;
    fresh.friendName = currentState.friendName;
    currentState = fresh;
    notifyClients();
    res.json({ success: true, state: currentState });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐼 Daily Care Best-Friend server listening on http://localhost:${PORT}`);
  });
}

startServer();
