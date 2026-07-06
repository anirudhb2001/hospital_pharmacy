import React from 'react';
import { cn } from '../ui';

export default function OrderStatusBadge({ status }) {
  const styles = {
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    Processing: 'bg-amber-50 text-amber-700 border-amber-200',
    Packed: 'bg-purple-50 text-purple-700 border-purple-200',
    'Out for Delivery': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const defaultStyle = 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center', styles[status] || defaultStyle)}>
      {status || 'Unknown'}
    </span>
  );
}
