import React from 'react';
import { UserRole, UserProfile } from '../types';
import {
  Volume2,
  VolumeX,
  Download,
  Bell,
  Smartphone,
  Shield,
  Users,
  WifiOff,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPwaModal: () => void;
  onOpenNotificationModal: () => void;
  onOpenNotificationCenter: () => void;
  unreadNotificationCount: number;
  adminName: string;
  friendName: string;
  isOnline: boolean;
  user: User | null;
  userProfile: UserProfile | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  soundEnabled,
  onToggleSound,
  onOpenPwaModal,
  onOpenNotificationModal,
  onOpenNotificationCenter,
  unreadNotificationCount,
  adminName,
  friendName,
  isOnline,
  user,
  userProfile,
  onSignIn,
  onSignOut,
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
          {/* Real-time Notification Bell with Badge */}
          <button
            id="notification-center-btn"
            onClick={onOpenNotificationCenter}
            className="relative p-2 rounded-xl bg-stone-100 text-slate-700 border border-stone-200 hover:bg-stone-200/80 transition-colors"
            title="Open Notifications & Reminders"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white animate-bounce">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

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
              <span className="hidden sm:inline">Admin</span>
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
              <span className="hidden sm:inline">Friend</span>
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

          {/* User Auth Avatar / Sign In */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-1">
              <div
                className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-300"
                title={`Logged in as ${userProfile?.displayName || user.displayName || user.email}`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (userProfile?.displayName || user.displayName || user.email || 'P')
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              title="Sign In with Google"
            >
              <LogIn size={13} />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* PWA Install Button */}
          <button
            id="pwa-install-nav-btn"
            onClick={onOpenPwaModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Download size={13} />
            <span>Install</span>
          </button>
        </div>
      </div>
    </header>
  );
};
