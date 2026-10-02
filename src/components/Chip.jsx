import React, { forwardRef } from 'react';

export const Chip = forwardRef(({ label, className = '', ...props }, ref) => {
  return (
    <div ref={ref} className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-carbon-850 border border-carbon-700/80 text-xs md:text-sm text-slate-300 shadow-sm ${className}`} {...props}>
      <span className="w-2 h-2 rounded-full bg-brand"></span>
      <span>{label}</span>
    </div>
  );
});

Chip.displayName = 'Chip';
