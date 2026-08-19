import React, { useState } from 'react';
import { Download, Smartphone, Apple, CheckCircle2, Share2, PlusSquare, MoreVertical } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shadow-xs">
              🐼
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg font-display">
                Install Daily Care App
              </h3>
              <p className="text-xs text-slate-500">
                Add to your phone's Home Screen
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

        {/* Platform Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple size={15} />
            <span>iPhone / iPad (iOS)</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone size={15} />
            <span>Android (Chrome)</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        {activeTab === 'ios' ? (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-0.5">
                  Open in Safari & Tap Share
                </p>
                <p className="text-slate-500">
                  Tap the <strong className="text-slate-700">Share</strong> button <Share2 size={13} className="inline mx-0.5 text-blue-500" /> at the bottom bar of Safari.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-0.5">
                  Select "Add to Home Screen"
                </p>
                <p className="text-slate-500">
                  Scroll down the share sheet and tap <strong className="text-slate-700">"Add to Home Screen"</strong> <PlusSquare size={13} className="inline mx-0.5" />.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-0.5">
                  Tap "Add" in Top Right
                </p>
                <p className="text-slate-500">
                  Daily Care 🐼 will appear on your home screen just like a native app with full screen view!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-0.5">
                  Open Chrome Browser Menu
                </p>
                <p className="text-slate-500">
                  Tap the 3 dots <MoreVertical size={13} className="inline mx-0.5" /> in the top-right corner of Chrome.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-0.5">
                  Tap "Install App" or "Add to Home screen"
                </p>
                <p className="text-slate-500">
                  Select <strong className="text-slate-700">Install App</strong> from the options.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-0.5">
                  Confirm Install
                </p>
                <p className="text-slate-500">
                  Tap <strong className="text-slate-700">Install</strong>. Daily Care will launch directly from your home screen with fast offline caching!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
