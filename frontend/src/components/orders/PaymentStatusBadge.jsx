import React from 'react';
import { cn } from '../ui';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function PaymentStatusBadge({ status }) {
  const styles = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Partially Paid': 'bg-teal-50 text-teal-700 border-teal-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Failed: 'bg-red-50 text-red-700 border-red-200',
    Refunded: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const icons = {
    Paid: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    Pending: <Clock className="w-3.5 h-3.5 mr-1" />,
    Failed: <XCircle className="w-3.5 h-3.5 mr-1" />
  };

  const defaultStyle = 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center', styles[status] || defaultStyle)}>
      {icons[status] || null}
      {status || 'Unknown'}
    </span>
  );
}
