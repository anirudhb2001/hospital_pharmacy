import React from 'react';
import { Pill } from 'lucide-react';

export default function OrderItem({ item }) {
  return (
    <div className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 items-center">
      <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-2 shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.medicine_name} className="w-full h-full object-contain" />
        ) : (
          <Pill className="w-6 h-6 text-gray-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{item.medicine_name}</h4>
        {item.generic_name && (
          <p className="text-xs text-gray-500 truncate">{item.generic_name}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          Qty: <span className="font-medium text-gray-900">{item.qty}</span>
        </p>
      </div>
      <div className="text-right shrink-0">
        <div className="font-semibold text-gray-900">₹{item.amount.toFixed(2)}</div>
        <div className="text-xs text-gray-500">₹{item.rate.toFixed(2)} / item</div>
      </div>
    </div>
  );
}
