import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ClayCard = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-clay p-6 transition-all duration-300 dark:bg-gray-800 dark:shadow-clay-dark",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const baseStyle = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white shadow-clay hover:-translate-y-1 hover:shadow-lg dark:shadow-clay-dark",
    secondary: "bg-white text-gray-800 shadow-clay hover:-translate-y-1 dark:bg-gray-800 dark:text-white dark:shadow-clay-dark",
    danger: "bg-danger text-white shadow-clay hover:-translate-y-1",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      ref={ref}
      disabled={isLoading}
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});

export const Input = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border-none bg-background px-4 py-3 text-sm shadow-clay-inset transition-all focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900",
          error && "ring-2 ring-danger",
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-danger">{error.message}</span>}
    </div>
  );
});

export const StatusBadge = ({ status, className }) => {
  const styles = {
    Active: "bg-success/10 text-success border-success/20",
    Inactive: "bg-gray-100 text-gray-600 border-gray-200",
    Low: "bg-warning/10 text-warning border-warning/20",
    Expired: "bg-danger/10 text-danger border-danger/20"
  };
  
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status] || styles.Active, className)}>
      {status}
    </span>
  );
};
