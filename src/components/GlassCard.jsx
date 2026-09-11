import React from 'react';

export const GlassCard = ({ children, className = '', glowColor = 'cyan', hoverable = false }) => {
  const borderGlow =
    glowColor === 'emerald'
      ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-emerald-950/20'
      : glowColor === 'amber'
      ? 'border-amber-500/20 hover:border-amber-500/40 shadow-amber-950/20'
      : 'border-cyan-500/20 hover:border-cyan-500/40 shadow-cyan-950/20';

  const hoverClass = hoverable
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
    : '';

  return (
    <div
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl border ${borderGlow} ${hoverClass} ${className}`}
    >
      {/* Corner accent vectors */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 rounded-br-sm pointer-events-none" />

      {children}
    </div>
  );
};
