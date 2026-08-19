import React, { useState } from 'react';
import { CareNotificationItem, MealId } from '../types';
import {
  Bell,
  CheckCircle2,
  XCircle,
  Droplet,
  Moon,
  Heart,
  Clock,
  Trash2,
  CheckCheck,
  X,
  User,
} from 'lucide-react';
import {
  markNotificationAsRead,
  respondToNotification,
  deleteCareNotification,
} from '../services/notificationService';
import { playDropletSound, playMealChime } from '../utils/sound';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CareNotificationItem[];
  currentUserId?: string;
  soundEnabled: boolean;
  onActionMeal?: (mealId: MealId, status: 'ate' | 'not_eaten') => void;
  onActionWater?: (amountMl: number) => void;
  onActionSleep?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  soundEnabled,
  onActionMeal,
  onActionWater,
  onActionSleep,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleMarkAllRead = async () => {
    playDropletSound(soundEnabled);
    for (const notif of notifications.filter((n) => !n.read)) {
      await markNotificationAsRead(notif.id);
    }
  };

  const handleQuickResponse = async (
    notif: CareNotificationItem,
    actionText: string,
    callback?: () => void
  ) => {
    playMealChime(soundEnabled);
    await respondToNotification(notif.id, actionText);
    if (callback) callback();
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' +
        date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl border border-emerald-200">
              🔔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base sm:text-lg font-display">
                  Notifications & Reminders
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Real-time best-friend care alerts from Firestore
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between gap-2 py-3 shrink-0">
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-xl transition-all ${
                filter === 'unread' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {displayedNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <div className="text-3xl">🐼✨</div>
              <p className="text-sm font-medium text-slate-600">
                {filter === 'unread' ? 'No unread notifications!' : 'No notifications yet'}
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                When your best friend or admin sends a care reminder, it will appear here in real-time.
              </p>
            </div>
          ) : (
            displayedNotifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    !notif.read
                      ? 'bg-emerald-50/40 border-emerald-200/90 shadow-2xs'
                      : 'bg-stone-50/60 border-stone-200/70 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{notif.emoji || '🐼'}</span>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock size={11} />
                      <span>{formatTime(notif.createdAt)}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2.5">
                    {notif.message}
                  </p>

                  {/* Sender Badge & Action Response */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/50">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <User size={11} />
                      <span>
                        From: <strong>{notif.senderName}</strong>
                      </span>
                    </div>

                    {/* If action has already been taken */}
                    {notif.actionTaken ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <CheckCircle2 size={12} />
                        <span>Response: {notif.actionTaken}</span>
                      </span>
                    ) : (
                      /* Quick 1-tap interactive response buttons */
                      <div className="flex flex-wrap items-center gap-1.5">
                        {notif.type === 'meal' && (
                          <>
                            <button
                              onClick={() =>
                                handleQuickResponse(notif, 'Yes, I ate 🍳', () => {
                                  if (onActionMeal) onActionMeal('breakfast', 'ate');
                                })
                              }
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-transform active:scale-95"
                            >
                              Yes, I ate 🍳
                            </button>
                            <button
                              onClick={() => handleQuickResponse(notif, "Haven't eaten yet")}
                              className="px-2.5 py-1 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-[11px] font-bold"
                            >
                              Not yet
                            </button>
                          </>
                        )}

                        {notif.type === 'water' && (
                          <button
                            onClick={() =>
                              handleQuickResponse(notif, 'Drank water 💧', () => {
                                if (onActionWater) onActionWater(250);
                              })
                            }
                            className="px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold flex items-center gap-1 transition-transform active:scale-95"
                          >
                            <Droplet size={11} className="fill-white" />
                            <span>Drank 250ml</span>
                          </button>
                        )}

                        {notif.type === 'sleep' && (
                          <button
                            onClick={() =>
                              handleQuickResponse(notif, 'Got 8 hours of sleep 😴', () => {
                                if (onActionSleep) onActionSleep();
                              })
                            }
                            className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 transition-transform active:scale-95"
                          >
                            <Moon size={11} />
                            <span>Got 8h sleep</span>
                          </button>
                        )}

                        {notif.type === 'period' && (
                          <button
                            onClick={() => handleQuickResponse(notif, 'Drinking warm tea 🍵')}
                            className="px-2.5 py-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 transition-transform active:scale-95"
                          >
                            <span>🍵 Warm tea & cozy</span>
                          </button>
                        )}

                        {notif.type === 'nudge' && (
                          <button
                            onClick={() => handleQuickResponse(notif, 'Thanks buddy! 🐼')}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-transform active:scale-95"
                          >
                            Thanks buddy! 🐼
                          </button>
                        )}

                        {!notif.read && !notif.actionTaken && (
                          <button
                            onClick={() => markNotificationAsRead(notif.id)}
                            className="px-2 py-1 rounded-xl text-stone-400 hover:text-stone-700 text-[11px] font-medium"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
