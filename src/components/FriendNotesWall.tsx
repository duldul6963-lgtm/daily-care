import React, { useState } from 'react';
import { FriendCheckInMessage, UserRole } from '../types';
import { playDropletSound } from '../utils/sound';
import { MessageSquare, Send, Sparkles, User, ThumbsUp } from 'lucide-react';

interface FriendNotesWallProps {
  messages: FriendCheckInMessage[];
  role: UserRole;
  adminName: string;
  friendName: string;
  soundEnabled: boolean;
  onSendMessage: (text: string, emoji?: string) => void;
}

export const FriendNotesWall: React.FC<FriendNotesWallProps> = ({
  messages,
  role,
  adminName,
  friendName,
  soundEnabled,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  const quickBestFriendPhrases = [
    { text: 'Just checking in 🐼', emoji: '🐼' },
    { text: 'Time for some water 💧', emoji: '💧' },
    { text: "Don't forget your lunch 🙂", emoji: '🥪' },
    { text: "Nice, you've had your water! 🙌", emoji: '🙌' },
    { text: 'Take care of yourself! ⭐', emoji: '⭐' },
    { text: 'Thanks buddy! 🐼', emoji: '🐼' },
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    playDropletSound(soundEnabled);
    onSendMessage(inputText.trim(), '🐼');
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl border border-teal-200">
            💬
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800 font-display">
              Best Friend Check-Ins
            </h3>
            <p className="text-xs text-slate-500">
              Gentle reminders & encouragement between {adminName} & {friendName}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Friendly Phrases Chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {quickBestFriendPhrases.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => {
              playDropletSound(soundEnabled);
              onSendMessage(phrase.text, phrase.emoji);
            }}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200/80 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1 active:scale-95"
          >
            <span>{phrase.emoji}</span>
            <span>{phrase.text}</span>
          </button>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center gap-2 mb-5">
        <input
          type="text"
          placeholder={
            role === 'admin'
              ? `Send a gentle reminder to ${friendName}...`
              : `Reply to ${adminName}...`
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-800 placeholder:text-stone-400 focus:outline-emerald-500 focus:bg-white transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Send size={14} />
          <span>Send</span>
        </button>
      </div>

      {/* Message Feed */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No check-in messages yet. Send a friendly reminder! 🐼
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === role;
            const timeFormatted = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                  isMe
                    ? 'bg-emerald-50/70 border-emerald-200/90 ml-4'
                    : 'bg-stone-50 border-stone-200 mr-4'
                }`}
              >
                <span className="text-lg shrink-0 mt-0.5 select-none">{msg.emoji || '🐼'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-bold text-slate-800 text-xs">
                      {msg.senderName} {isMe ? '(You)' : ''}
                    </span>
                    <span className="text-[10px] text-slate-400">{timeFormatted}</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
