import React from 'react';
import { audioEngine } from '../utils/audioEngine';

export const NeonButton = ({
  children,
  onClick,
  variant = 'cyan', // 'cyan', 'emerald', 'rose', 'ghost'
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    audioEngine.playBeep(variant === 'emerald' ? 1050 : 850, 0.04);
    if (onClick) onClick(e);
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-xl',
    lg: 'px-7 py-3.5 text-base font-bold rounded-2xl',
  };

  const variants = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/40 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/40 hover:bg-emerald-500/20 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-400/40 hover:bg-rose-500/20 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] active:scale-95',
    ghost: 'bg-slate-800/40 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-500 active:scale-95',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`font-mono-tech tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
