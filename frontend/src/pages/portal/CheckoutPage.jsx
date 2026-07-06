import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, MapPin, Phone, FileText, CreditCard } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { Card, Button, Input, Select } from '../../components/ui';
import { callMethod, parseFrappeError } from '../../api';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);

  if (items.length === 0 && !successData) {
    navigate('/cart');
    return null;
  }

  const subtotal = getCartTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const cartItems = items.map(i => ({
      item_code: i.medicine.item,
      qty: i.quantity,
      rate: i.medicine.selling_price
    }));

    const payload = {
      items: cartItems,
      address: data.address,
      phone: data.phone,
      notes: data.notes,
      payment_method: data.payment_method
    };

    if (data.payment_method === 'Online Payment') {
      setPendingOrderData(payload);
      setShowPaymentModal(true);
      setLoading(false);
    } else {
      await executeOrder(payload);
    }
  };

  const executeOrder = async (payload) => {
    setLoading(true);
    try {
      const response = await callMethod('hospital_pharmacy.api.place_order', payload);
      
      if (response.status === 'error') {
        setError(response.message);
        setShowPaymentModal(false);
      } else {
        clearCart();
        setShowPaymentModal(false);
        setSuccessData({
          orderId: response.order_id,
          delivery: response.estimated_delivery,
          payment: payload.payment_method
        });
      }
    } catch (err) {
      setError(parseFrappeError(err));
      setShowPaymentModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-8 relative">
      <AnimatePresence>
        {successData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-inner"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </motion.div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Order Successfully Placed!</h1>
            <p className="text-xl font-medium text-slate-500 mb-10 max-w-lg">
              Thank you for shopping with us. Your order <span className="font-bold text-slate-900">#{successData.orderId}</span> is confirmed and being processed.
            </p>
            
            <Card className="p-8 w-full max-w-md bg-slate-50 border border-slate-100 mb-10">
              <div className="space-y-4 text-left">
                <div className="flex justify-between border-b border-slate-200 pb-4">
                  <span className="text-slate-500 font-semibold">Estimated Delivery</span>
                  <span className="font-bold text-slate-900">{successData.delivery}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-4">
                  <span className="text-slate-500 font-semibold">Payment Status</span>
                  <span className="font-bold text-emerald-600">{successData.payment === 'Online Payment' ? 'Paid Online' : 'Cash on Delivery'}</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button variant="secondary" size="lg" onClick={() => navigate('/orders')}>
                View My Orders
              </Button>
              <Button variant="primary" size="lg" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-slate-500 font-medium mt-2">Complete your order securely</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        <div className="lg:col-span-3 space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 font-semibold rounded-r-xl">
              {error}
            </div>
          )}

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><MapPin className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-slate-900">Delivery Details</h2>
            </div>
            <div className="space-y-5">
              <Input 
                name="phone" 
                label="Phone Number" 
                placeholder="10-digit mobile number" 
                required 
                pattern="[0-9]{10}"
              />
              <div className="w-full space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Full Address</label>
                <textarea 
                  name="address" 
                  required
                  rows={4}
                  className="w-full px-5 py-3.5 rounded-2xl text-base outline-none transition-all duration-300 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-[inset_2px_2px_4px_#e2e8f0,inset_-2px_-2px_4px_#ffffff]"
                  placeholder="House No, Building, Street, City, Pincode"
                />
              </div>
              <Input 
                name="notes" 
                label="Delivery Notes (Optional)" 
                placeholder="e.g. Please leave at the security gate" 
              />
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CreditCard className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" name="payment_method" value="Cash on Delivery" defaultChecked className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <div className="ml-4 flex-1">
                  <span className="block font-bold text-slate-900">Cash on Delivery</span>
                  <span className="block text-sm font-medium text-slate-500 mt-0.5">Pay when your order arrives</span>
                </div>
              </label>
              <label className="flex items-center p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input type="radio" name="payment_method" value="Online Payment" className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <div className="ml-4 flex-1">
                  <span className="block font-bold text-slate-900">Online Payment</span>
                  <span className="block text-sm font-medium text-slate-500 mt-0.5">Pay securely via Credit/Debit Card, UPI, or Netbanking</span>
                </div>
              </label>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-8 sticky top-32 bg-slate-50/50 backdrop-blur-xl border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><FileText className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>
            </div>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map(({ medicine, quantity }) => (
                <div key={medicine.name} className="flex justify-between items-center text-sm font-medium">
                  <div className="flex-1 pr-4">
                    <p className="text-slate-900 font-bold line-clamp-1">{medicine.medicine_name}</p>
                    <p className="text-slate-500">Qty: {quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900">₹{(parseFloat(medicine.selling_price) * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-slate-600 font-medium mb-8 pt-6 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="font-bold text-emerald-500">Free</span>
              </div>
            </div>
            
            <div className="pt-6 border-t-2 border-slate-200 border-dashed mb-8">
              <div className="flex justify-between items-end">
                <span className="text-xl font-bold text-slate-900">Total Payable</span>
                <span className="text-4xl font-black text-blue-600 tracking-tight">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 text-lg shadow-[0_8px_20px_rgba(37,99,235,0.3)]" isLoading={loading}>
              Place Order
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure SSL Checkout
            </div>
          </Card>
        </div>
      </form>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <Card className="relative p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Simulated Payment Gateway</h2>
            <p className="text-slate-500 font-medium mb-8">This is a mock payment screen for demonstration purposes.</p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount to Pay</p>
              <p className="text-4xl font-black text-blue-600">₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={() => executeOrder(pendingOrderData)} isLoading={loading}>Pay Now</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
