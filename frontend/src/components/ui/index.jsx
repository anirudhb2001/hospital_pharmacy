import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Star, Search, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Card (Claymorphism) ──────────────────────────────────────────
export const Card = ({ children, className, hover = false, ...props }) => (
  <div
    className={cn(
      'bg-white rounded-[24px] border border-white',
      'shadow-[8px_8px_16px_#e2e8f0,-8px_-8px_16px_#ffffff]',
      hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff]',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
export const ClayCard = Card; // Backwards compatibility

// ── Button ─────────────────────────────────────────────────────
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const base = 'relative overflow-hidden inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';
  
  const variants = {
    primary: 'bg-blue-600 text-white shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:shadow-[0_12px_20px_-4px_rgba(37,99,235,0.5)] focus:ring-blue-500',
    secondary: 'bg-white text-slate-800 border border-slate-100 shadow-[4px_4px_10px_#e2e8f0,-4px_-4px_10px_#ffffff] hover:shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] focus:ring-slate-300',
    accent: 'bg-emerald-500 text-white shadow-[0_8px_16px_-4px_rgba(16,185,129,0.4)] hover:bg-emerald-600 focus:ring-emerald-500',
    danger: 'bg-rose-500 text-white shadow-[0_8px_16px_-4px_rgba(244,63,94,0.4)] hover:bg-rose-600 focus:ring-rose-500',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    outline: 'border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600',
  };
  
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };

  return (
    <button ref={ref} disabled={isLoading} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {isLoading && (
        <svg className="animate-spin h-5 w-5 absolute" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      <span className={cn('flex items-center gap-2', isLoading && 'opacity-0')}>{children}</span>
    </button>
  );
});
Button.displayName = 'Button';

// ── Input ──────────────────────────────────────────────────────
export const Input = React.forwardRef(({ className, error, label, ...props }, ref) => (
  <div className="w-full space-y-2">
    {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'w-full px-5 py-3.5 rounded-2xl text-base outline-none transition-all duration-300',
        'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400',
        'focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
        'shadow-[inset_2px_2px_4px_#e2e8f0,inset_-2px_-2px_4px_#ffffff]',
        error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 ring-1 ring-rose-400',
        className
      )}
      {...props}
    />
    {error && <p className="text-sm font-medium text-rose-500">{error.message || error}</p>}
  </div>
));
Input.displayName = 'Input';

export const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'w-full px-5 py-3.5 rounded-2xl text-base outline-none transition-all duration-300 cursor-pointer appearance-none',
      'bg-slate-50 border border-slate-200 text-slate-800',
      'focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
      'shadow-[inset_2px_2px_4px_#e2e8f0,inset_-2px_-2px_4px_#ffffff]',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

// ── Badge & Status Badge ───────────────────────────────────────
export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-700',
  };
  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase', variants[variant], className)}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, className }) => {
  const isGood = ['Active', 'In Stock', 'Delivered', 'Paid', 'Confirmed'].includes(status);
  const isWarn = ['Low Stock', 'Low', 'Processing', 'Packed', 'Shipped'].includes(status);
  const isBad = ['Inactive', 'Expired', 'Out of Stock', 'Cancelled', 'Unpaid'].includes(status);
  
  return (
    <Badge 
      variant={isGood ? 'success' : isWarn ? 'warning' : isBad ? 'danger' : 'default'} 
      className={className}
    >
      {status}
    </Badge>
  );
};

// ── Modal (Glassmorphism) ──────────────────────────────────────
export const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn('relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden', className)}
      >
        {children}
      </motion.div>
    </div>
  );
};

// ── Skeleton ───────────────────────────────────────────────────
export const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse bg-slate-200/60 rounded-2xl', className)} />
);

// ── SearchBar ──────────────────────────────────────────────────
export const SearchBar = ({ className, ...props }) => (
  <div className={cn("relative w-full group", className)}>
    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
    <input 
      type="text" 
      className="w-full pl-13 pr-6 py-4 bg-white/80 backdrop-blur-xl border border-white rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_8px_24px_rgba(37,99,235,0.1)] outline-none text-slate-800 placeholder-slate-400 font-medium transition-all"
      {...props}
    />
  </div>
);

// ── PriceTag ───────────────────────────────────────────────────
export const PriceTag = ({ price, mrp, className }) => {
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className="text-xl font-extrabold text-slate-900">₹{price.toFixed(2)}</span>
      {mrp > price && (
        <>
          <span className="text-sm font-semibold text-slate-400 line-through">₹{mrp.toFixed(2)}</span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{discount}% OFF</span>
        </>
      )}
    </div>
  );
};

// ── QuantitySelector ───────────────────────────────────────────
export const QuantitySelector = ({ qty, setQty, max = 99, className }) => (
  <div className={cn("flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner", className)}>
    <button 
      onClick={() => setQty(Math.max(1, qty - 1))}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-600 hover:text-blue-600 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
      disabled={qty <= 1}
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="w-10 text-center font-bold text-slate-800">{qty}</span>
    <button 
      onClick={() => setQty(Math.min(max, qty + 1))}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-600 hover:text-blue-600 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
      disabled={qty >= max}
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

// ── SectionTitle ───────────────────────────────────────────────
export const SectionTitle = ({ title, subtitle, className }) => (
  <div className={cn("mb-8", className)}>
    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-500 font-medium mt-2 text-lg">{subtitle}</p>}
  </div>
);

// ── Rating ─────────────────────────────────────────────────────
export const Rating = ({ value = 4.5, count = 120, className }) => (
  <div className={cn("flex items-center gap-1.5", className)}>
    <div className="flex items-center bg-emerald-500 text-white px-2 py-0.5 rounded-md gap-1">
      <span className="text-xs font-bold">{value}</span>
      <Star className="w-3 h-3 fill-current" />
    </div>
    {count > 0 && <span className="text-xs font-medium text-slate-400">({count})</span>}
  </div>
);

// ── Avatar ─────────────────────────────────────────────────────
export const Avatar = ({ name, url, size = 'md', className }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  return (
    <div className={cn("relative rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md", sizes[size], className)}>
      {url ? (
        <img src={url} alt={name} className="w-full h-full object-cover rounded-full" />
      ) : (
        name?.charAt(0).toUpperCase() || 'U'
      )}
    </div>
  );
};

// Export external components
export * from './ProductCard';
export * from './CategoryCard';
// If StatsCard is in CategoryCard file
