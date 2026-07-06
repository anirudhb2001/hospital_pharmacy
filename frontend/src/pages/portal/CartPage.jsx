import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { ClayCard, Button } from '../../components/ui';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='40' fill='%2394a3b8'%3E💊%3C/text%3E%3C/svg%3E";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Looks like you haven't added any medicines to your cart yet.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ medicine, quantity }) => (
            <ClayCard key={medicine.name} className="flex flex-col sm:flex-row p-4 gap-4 items-center">
              <img 
                src={medicine.image ? (medicine.image.startsWith('http') || medicine.image.startsWith('/') ? medicine.image : `/${medicine.image}`) : PLACEHOLDER_IMG}
                alt={medicine.medicine_name} 
                className="w-24 h-24 object-cover rounded-xl bg-gray-50"
                onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-gray-900">{medicine.medicine_name}</h3>
                <p className="text-sm text-gray-500 mb-2">{medicine.generic_name || medicine.category}</p>
                <p className="font-bold text-blue-700">₹{parseFloat(medicine.selling_price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 shadow-clay-inset">
                <button 
                  onClick={() => updateQuantity(medicine.name, quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-blue-600 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
                <button 
                  onClick={() => updateQuantity(medicine.name, quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-blue-600 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-right ml-4">
                <p className="font-bold text-gray-900 hidden sm:block mb-2">
                  ₹{(parseFloat(medicine.selling_price) * quantity).toFixed(2)}
                </p>
                <button 
                  onClick={() => removeItem(medicine.name)}
                  className="text-red-400 hover:text-red-600 transition p-2 bg-red-50 rounded-lg"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </ClayCard>
          ))}
          <div className="pt-4">
            <Link to="/">
              <Button variant="ghost" size="md" className="gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ClayCard className="p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Estimate</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-700">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </ClayCard>
        </div>
      </div>
    </div>
  );
}
