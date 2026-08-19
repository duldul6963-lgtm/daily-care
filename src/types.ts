export type UserRole = 'admin' | 'friend';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: string;
  lastActive?: string;
}

export type NotificationType = 'meal' | 'water' | 'sleep' | 'period' | 'nudge' | 'custom';

export interface CareNotificationItem {
  id: string;
  recipientId: string;
  recipientEmail?: string;
  recipientName?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  type: NotificationType;
  title: string;
  message: string;
  emoji?: string;
  read: boolean;
  actionTaken?: string;
  createdAt: string;
}

export type MealId = 'breakfast' | 'lunch' | 'dinner';

export type MealStatusType = 'ate' | 'not_eaten' | 'waiting' | 'upcoming';

export interface MealRecord {
  id: MealId;
  name: string;
  emoji: string;
  time: string; // "08:00", "13:00", "20:00"
  status: MealStatusType;
  completedAt?: string;
  notes?: string;
}

export type WaterSlotStatusType = 'completed' | 'not_yet' | 'waiting' | 'upcoming';

export interface WaterSlotRecord {
  id: string;
  time: string;
  targetMl: number;
  status: WaterSlotStatusType;
  completedAt?: string;
}

export interface SleepRecord {
  targetHours: number; // default 8
  bedtime: string; // default "23:00"
  wakeTime: string; // default "07:00"
  hoursSlept?: number; // e.g. 8.0
  quality?: 'great' | 'okay' | 'tired';
  status: 'logged' | 'waiting' | 'upcoming';
  loggedAt?: string;
  notes?: string;
}

export interface PeriodCycleRecord {
  lastPeriodStartDate: string; // "2026-08-10"
  cycleLengthDays: number; // default 28
  periodDurationDays: number; // default 5
  isPeriodActive: boolean;
  currentCycleDay: number;
  daysUntilNextPeriod: number;
  phase: 'period' | 'follicular' | 'ovulation' | 'luteal';
  symptoms: string[]; // ["Mild Cramps", "Craving Warm Tea", "Tired", "Cozy"]
  flow?: 'light' | 'medium' | 'heavy';
  lastUpdated?: string;
}

export interface FriendCheckInMessage {
  id: string;
  sender: 'admin' | 'friend';
  senderName: string;
  text: string;
  emoji: string;
  createdAt: string;
}

export interface DayHistoryRecord {
  date: string; // "2026-08-19"
  formattedDate: string; // "19 August"
  breakfast: MealStatusType;
  lunch: MealStatusType;
  dinner: MealStatusType;
  waterCompletedCount: number;
  waterTotalCount: number;
  sleepHours?: number;
  sleepQuality?: 'great' | 'okay' | 'tired';
  periodDay?: number;
  isPeriodActive?: boolean;
  lastActivity?: string;
}

export interface CareSettings {
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
}

export interface CareState {
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
  settings: CareSettings;
  lastUpdated: string;
}
