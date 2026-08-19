import React, { useState } from 'react';
import { DayHistoryRecord, CareState } from '../types';
import { Calendar, CheckCircle2, XCircle, Clock, Droplet, Moon, Heart } from 'lucide-react';

interface HistoryViewProps {
  history?: DayHistoryRecord[];
  state?: CareState;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, state }) => {
  const [filterRange, setFilterRange] = useState<'all' | 'yesterday' | '7days' | '30days'>('all');

  const historyList = history || state?.history || [];

  const displayedRecords = historyList.filter((rec, idx) => {
    if (filterRange === 'yesterday') return idx === 0;
    if (filterRange === '7days') return idx < 7;
    if (filterRange === '30days') return idx < 30;
    return true;
  });

  const renderMealBadge = (label: string, status: string) => {
    if (status === 'ate') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
          <span>{label}</span>
          <CheckCircle2 size={12} />
        </span>
      );
    }
    if (status === 'not_eaten') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold">
          <span>{label}</span>
          <XCircle size={12} />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-200 text-stone-600 text-xs font-medium">
        <span>{label}</span>
        <Clock size={12} className="text-stone-400" />
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl border border-indigo-200">
            📅
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display">
              Care & Check-In History
            </h3>
            <p className="text-xs text-slate-500">
              Review daily sleep, meal, water, and cycle records
            </p>
          </div>
        </div>

        {/* Range Filter Buttons */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setFilterRange('all')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              filterRange === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterRange('yesterday')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              filterRange === 'yesterday' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setFilterRange('7days')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              filterRange === '7days' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setFilterRange('30days')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              filterRange === '30days' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* History Record Cards */}
      <div className="space-y-3">
        {displayedRecords.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No history logs recorded yet. Daily records will appear here automatically! 🐼
          </div>
        ) : (
          displayedRecords.map((item, index) => {
            return (
              <div
                key={item.date || index}
                className="p-4 rounded-2xl border bg-stone-50/70 border-stone-200/80 hover:bg-stone-50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-800 font-display">
                      {item.formattedDate || item.date}
                    </span>
                  </div>

                  {item.lastActivity && (
                    <span className="text-xs text-slate-500 font-medium">
                      Last activity: <strong className="text-slate-700">{item.lastActivity}</strong>
                    </span>
                  )}
                </div>

                {/* Badges Grid */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Sleep Stat */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-900 text-xs font-bold">
                    <Moon size={12} className="fill-indigo-600" />
                    <span>Sleep: {item.sleepHours ? `${item.sleepHours}h` : '8.0h'}</span>
                  </span>

                  {/* Period / Cycle Stat */}
                  {item.periodDay && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold">
                      <span>🌸</span>
                      <span>
                        {item.isPeriodActive ? `Period Day ${item.periodDay}` : `Cycle Day ${item.periodDay}`}
                      </span>
                    </span>
                  )}

                  {/* Meals */}
                  {renderMealBadge('Breakfast', item.breakfast)}
                  {renderMealBadge('Lunch', item.lunch)}
                  {renderMealBadge('Dinner', item.dinner)}

                  {/* Water Stat */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-100 text-sky-800 text-xs font-bold">
                    <Droplet size={12} className="fill-sky-700" />
                    <span>Water: {item.waterCompletedCount} / {item.waterTotalCount || 8}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
