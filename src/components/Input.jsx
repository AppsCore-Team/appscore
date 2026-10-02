import React, { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', as: Component = 'input', ...props }, ref) => {
  return (
    <Component 
      ref={ref}
      className={`w-full px-4 py-3 rounded-xl bg-carbon-900 border border-carbon-border text-white text-sm focus:outline-none focus:border-brand transition-colors ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
