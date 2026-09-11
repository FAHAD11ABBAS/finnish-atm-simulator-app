import React from 'react';
import { useBank } from '../context/BankContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const ToastFeed = () => {
  const { toasts } = useBank();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-cyan-500/50 bg-slate-900/90 text-cyan-300';
        let Icon = Info;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/50 bg-emerald-950/90 text-emerald-300 neon-glow-emerald';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/50 bg-rose-950/90 text-rose-300';
          Icon = XCircle;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/50 bg-amber-950/90 text-amber-300';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transform transition-all duration-300 animate-slide-in ${borderClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-mono-tech leading-snug">{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
};
