import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Claymorphism Card ──────────────────────────────────────────
export const ClayCard = ({ children, className, hover = true, ...props }) => (
  <div
    className={cn(
      'bg-white rounded-2xl border border-white/60',
      'shadow-[6px_6px_12px_#d1d9e6,-4px_-4px_10px_#ffffff]',
      hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_12px_20px_#c8d0dd,-4px_-4px_12px_#ffffff]',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// ── Button ─────────────────────────────────────────────────────
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-blue-600 text-white shadow-[4px_4px_8px_#2563eb55] hover:bg-blue-700 hover:-translate-y-0.5 focus:ring-blue-500',
    secondary: 'bg-white text-gray-700 shadow-[4px_4px_8px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:-translate-y-0.5 focus:ring-gray-300',
    accent: 'bg-emerald-500 text-white shadow-[4px_4px_8px_#10b98155] hover:bg-emerald-600 hover:-translate-y-0.5 focus:ring-emerald-500',
    danger: 'bg-red-500 text-white shadow-[4px_4px_8px_#ef444455] hover:bg-red-600 hover:-translate-y-0.5 focus:ring-red-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:-translate-y-0.5',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' };

  return (
    <button ref={ref} disabled={isLoading} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {isLoading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

// ── Input ──────────────────────────────────────────────────────
export const Input = React.forwardRef(({ className, error, label, ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200',
        'bg-gray-50 shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]',
        'border border-transparent focus:ring-2 focus:ring-blue-400 focus:bg-white',
        error && 'ring-2 ring-red-400',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error.message || error}</p>}
  </div>
));
Input.displayName = 'Input';

// ── Select ─────────────────────────────────────────────────────
export const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 cursor-pointer',
      'bg-gray-50 shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]',
      'border border-transparent focus:ring-2 focus:ring-blue-400 focus:bg-white',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

// ── StatusBadge ────────────────────────────────────────────────
export const StatusBadge = ({ status, className }) => {
  const styles = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    Low: 'bg-amber-50 text-amber-700 border-amber-200',
    Expired: 'bg-red-50 text-red-700 border-red-200',
    'In Stock': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Out of Stock': 'bg-red-50 text-red-700 border-red-200',
    'Low Stock': 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold border', styles[status] || styles.Active, className)}>
      {status}
    </span>
  );
};

// ── Modal ──────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200', className)}>
        {children}
      </div>
    </div>
  );
};

// ── Skeleton ───────────────────────────────────────────────────
export const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] rounded-xl', className)} style={{ backgroundSize: '400% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
);
