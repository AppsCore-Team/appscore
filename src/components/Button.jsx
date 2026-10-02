import React, { forwardRef } from 'react';

export const Button = forwardRef(({ variant = 'primary', className = '', href, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold text-sm transition-all duration-300 rounded-full focus:outline-none';
  
  const variants = {
    primary: 'bg-brand text-black shadow-[0_10px_30px_rgba(153,222,29,0.25)] hover:bg-brand-hover hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-carbon-850 hover:bg-carbon-800 text-white font-medium border border-carbon-700/70',
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component ref={ref} href={href} className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </Component>
  );
});

Button.displayName = 'Button';
