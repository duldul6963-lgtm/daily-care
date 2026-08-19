import React from 'react';
import { UserRole } from '../types';
import { Volume2, VolumeX, Download, Bell, Smartphone, Shield, Users, Wifi, WifiOff } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPwaModal: () => void;
  onOpenNotificationModal: () => void;
  adminName: string;
  friendName: string;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  soundEnabled,
  onToggleSound,
  onOpenPwaModal,
  onOpenNotificationModal,
  adminName,
  friendName,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFBF5]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-xs text-white shrink-0 text-2xl select-none">
            🐼
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-lg sm:text-xl text-slate-800 tracking-tight leading-none font-display">
                Daily Care
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate font-medium flex items-center gap-1 mt-0.5">
              <span>{currentRole === 'admin' ? `Admin: ${adminName}` : `Friend: ${friendName}`}</span>
              {!isOnline && (
                <span className="text-amber-600 font-semibold flex items-center gap-0.5 text-[10px]">
                  <WifiOff size={10} /> Offline
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Actions & Role Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Best-Friend Role Switcher */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200 text-xs font-semibold">
            <button
              id="role-admin-btn"
              onClick={() => onRoleChange('admin')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                currentRole === 'admin'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Switch to Admin Management View"
            >
              <Shield size={13} className="text-emerald-600" />
              <span>Admin</span>
            </button>
            <button
              id="role-friend-btn"
              onClick={() => onRoleChange('friend')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                currentRole === 'friend'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Switch to Friend View"
            >
              <Users size={13} />
              <span>Friend</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
            }`}
            title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Notification tester */}
          <button
            id="notification-modal-btn"
            onClick={onOpenNotificationModal}
            className="p-2 rounded-xl bg-stone-100 text-slate-600 border border-stone-200 hover:bg-stone-200/80 transition-colors"
            title="Push Notification Settings"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>

          {/* PWA Install Button */}
          <button
            id="pwa-install-nav-btn"
            onClick={onOpenPwaModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Download size={13} />
            <span>Install App</span>
          </button>
        </div>
      </div>
    </header>
  );
};
