import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { Card, Button, QuantitySelector } from '../../components/ui';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='40' fill='%2394a3b8'%3E💊%3C/text%3E%3C/svg%3E";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <ShoppingCart className="w-16 h-16 text-blue-300" />
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-lg font-medium text-slate-500 mb-10 text-center max-w-md">
          Looks like you haven't added any medicines to your cart yet. Discover our premium healthcare products.
        </p>
        <Link to="/medicines">
          <Button size="lg" className="w-64">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">{items.length} Items</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map(({ medicine, quantity }) => (
              <motion.div key={medicine.name} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Card className="flex flex-col sm:flex-row p-5 gap-6 items-center">
                  <div className="relative w-32 h-32 shrink-0 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                    <img 
                      src={medicine.image ? (medicine.image.startsWith('http') || medicine.image.startsWith('/') ? medicine.image : `/${medicine.image}`) : PLACEHOLDER_IMG}
                      alt={medicine.medicine_name} 
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-extrabold text-xl text-slate-900 line-clamp-1 mb-1">{medicine.medicine_name}</h3>
                    <p className="text-sm font-medium text-slate-500 mb-4">{medicine.generic_name || medicine.category}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <span className="text-xl font-black text-blue-600">₹{parseFloat(medicine.selling_price).toFixed(2)}</span>
                      {medicine.mrp > medicine.selling_price && <span className="text-sm font-semibold text-slate-400 line-through">₹{parseFloat(medicine.mrp).toFixed(2)}</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-end gap-4 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                    <QuantitySelector 
                      qty={quantity} 
                      setQty={(newQty) => updateQuantity(medicine.name, newQty)} 
                      max={medicine.available_stock || 99}
                    />
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2">
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total</p>
                        <p className="text-xl font-black text-slate-900">
                          ₹{(parseFloat(medicine.selling_price) * quantity).toFixed(2)}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeItem(medicine.name)}
                        className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <div className="pt-6">
            <Link to="/medicines">
              <Button variant="ghost" className="gap-2 text-slate-500 hover:text-blue-600">
                <ArrowRight className="w-5 h-5 rotate-180" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-8 sticky top-32">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Order Summary</h2>
            
            <div className="space-y-4 text-slate-600 font-medium mb-8">
              <div className="flex justify-between items-center">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping Estimate</span>
                <span className="font-bold text-emerald-500">Free</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax Estimate</span>
                <span className="font-bold text-slate-900">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="pt-6 border-t-2 border-slate-100 border-dashed mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-4xl font-black text-blue-600 tracking-tight">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full h-14 text-lg shadow-[0_8px_20px_rgba(37,99,235,0.3)] mb-6"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Secure Payments
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <Truck className="w-5 h-5 text-blue-500" /> Fast & Free Delivery
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
