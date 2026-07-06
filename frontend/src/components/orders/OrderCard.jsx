import React from 'react';
import { ShoppingBag, ChevronRight, Download } from 'lucide-react';
import { ClayCard, Button } from '../ui';
import OrderStatusBadge from './OrderStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import { useCartStore } from '../../stores/useCartStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function OrderCard({ order, onViewDetails }) {
  const { addToCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleReorder = () => {
    // Add items back to cart
    if (order.items && order.items.length > 0) {
      clearCart(); // Optional: clear existing cart or just append
      order.items.forEach(item => {
        // Need to reconstruct the medicine object slightly to match cart expectations
        const med = {
          item: item.item_code,
          medicine_name: item.medicine_name || item.item_name,
          selling_price: item.rate,
          image: item.image,
          actual_qty: 999 // We assume in stock for reorder to allow it to go to cart, backend validates later
        };
        addToCart(med, item.qty);
      });
      toast.success('Items added to cart!');
      navigate('/cart');
    }
  };

  const itemThumbnails = order.items.slice(0, 3);
  const remainingItems = order.items.length > 3 ? order.items.length - 3 : 0;

  return (
    <ClayCard className="p-0 overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
            <p className="font-medium text-gray-900">{new Date(order.transaction_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total</p>
            <p className="font-medium text-gray-900">₹{order.grand_total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ship To</p>
            <p className="font-medium text-blue-600">Me</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order # {order.name}</p>
          <div className="flex items-center gap-2 justify-end">
            <PaymentStatusBadge status={order.payment_status} />
            <OrderStatusBadge status={order.order_status} />
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex-1 flex gap-4 w-full overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {itemThumbnails.map(item => (
            <div key={item.item_code} className="w-20 h-20 shrink-0 bg-white border border-gray-100 rounded-xl p-2 flex items-center justify-center relative group">
              {item.image ? (
                <img src={item.image} alt={item.medicine_name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
              ) : (
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              )}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                {item.qty}
              </div>
            </div>
          ))}
          {remainingItems > 0 && (
            <div className="w-20 h-20 shrink-0 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
              <span className="font-bold text-gray-500">+{remainingItems}</span>
            </div>
          )}
          <div className="my-auto ml-2">
            <h3 className="font-bold text-gray-900">{order.items.length} Medicines</h3>
            <p className="text-sm text-gray-500">Expected Delivery: {new Date(new Date(order.transaction_date).getTime() + 86400000).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-3 shrink-0">
          <Button variant="secondary" onClick={() => onViewDetails(order)} className="flex-1 md:flex-none">
            View Details
          </Button>
          <Button variant="primary" onClick={handleReorder} className="flex-1 md:flex-none">
            Reorder
          </Button>
        </div>
      </div>
    </ClayCard>
  );
}
