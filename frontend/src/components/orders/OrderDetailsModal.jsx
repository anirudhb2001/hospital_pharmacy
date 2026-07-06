import React from 'react';
import { X } from 'lucide-react';
import { Modal, Button } from '../ui';
import OrderTimeline from './OrderTimeline';
import OrderItem from './OrderItem';
import OrderStatusBadge from './OrderStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10 rounded-t-3xl">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <p className="text-sm text-gray-500 mt-1">Order # {order.name}</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto flex-1 hide-scrollbar bg-gray-50">
        
        {/* Badges & Date */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p className="font-semibold text-gray-900">
              {new Date(order.transaction_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <PaymentStatusBadge status={order.payment_status} />
            <OrderStatusBadge status={order.order_status} />
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Track Delivery</h3>
          <OrderTimeline currentStatus={order.order_status} />
        </div>

        {/* Items */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4 px-2">Medicines ({order.items.length})</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <OrderItem key={idx} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">₹{order.grand_total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between">
              <span className="font-bold text-gray-900">Grand Total</span>
              <span className="font-bold text-blue-600 text-lg">₹{order.grand_total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10 rounded-b-3xl flex justify-end">
        <Button variant="primary" onClick={onClose}>
          Close Details
        </Button>
      </div>
    </Modal>
  );
}
