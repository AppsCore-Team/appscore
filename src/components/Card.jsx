import React, { forwardRef } from 'react';

export const Card = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={`rounded-3xl bg-carbon-850 border border-carbon-border shadow-xl overflow-hidden ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
