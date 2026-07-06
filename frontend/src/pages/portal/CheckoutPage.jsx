import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { ClayCard, Button, Input } from '../../components/ui';
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
    
    // Structure items for API
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
    <div className="max-w-3xl mx-auto py-8 relative">
      <AnimatePresence>
        {successData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successfully Placed!</h1>
            <p className="text-lg text-gray-600 mb-8">
              {successData.payment === 'Online Payment' ? 'Payment Successful.' : 'Order Confirmed.'}
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-md border border-gray-100 mb-8 shadow-sm">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Order Number</span>
                <span className="font-bold text-gray-900">{successData.orderId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-900">{successData.payment}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Estimated Delivery</span>
                <span className="font-medium text-gray-900">{successData.delivery}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => navigate('/orders')}>
                View My Orders
              </Button>
              <Button variant="primary" onClick={() => navigate('/medicines')}>
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        )}

        {showPaymentModal && pendingOrderData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h2>
              <p className="text-sm text-gray-500 mb-6">You are about to pay ₹{subtotal.toFixed(2)}</p>
              
              <div className="space-y-3 mb-8">
                <div className="h-12 border border-gray-200 rounded-xl flex items-center px-4 bg-gray-50">
                  <span className="text-gray-400 text-sm">•••• •••• •••• 4242</span>
                  <div className="ml-auto w-8 h-5 bg-blue-600 rounded"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowPaymentModal(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => executeOrder(pendingOrderData)} isLoading={loading}>
                  Pay Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!successData && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <ClayCard className="p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Details</h2>
              <div className="space-y-4">
                <Input name="phone" type="tel" label="Phone Number" placeholder="10-digit mobile number" required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                  <textarea 
                    name="address" 
                    required 
                    rows={3} 
                    className="w-full px-4 py-3 rounded-xl bg-background shadow-clay-inset focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
                    placeholder="Full delivery address with landmark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                  <textarea 
                    name="notes" 
                    rows={2} 
                    className="w-full px-4 py-3 rounded-xl bg-background shadow-clay-inset focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
                    placeholder="Any special instructions for delivery"
                  />
                </div>
              </div>
            </ClayCard>

            <ClayCard className="p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50 cursor-pointer hover:bg-blue-50 transition">
                  <input type="radio" name="payment_method" value="Online Payment" defaultChecked className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-500">Pay now via credit card, UPI, or netbanking</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50 cursor-pointer hover:bg-blue-50 transition">
                  <input type="radio" name="payment_method" value="Cash on Delivery" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when your medicines arrive</p>
                  </div>
                </label>
              </div>
            </ClayCard>

            <div className="flex items-center justify-between p-6 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:relative md:shadow-none md:border-none md:p-0 md:bg-transparent">
              <div className="md:hidden">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-lg font-bold text-blue-700">₹{subtotal.toFixed(2)}</p>
              </div>
              <Button type="submit" variant="primary" size="lg" isLoading={loading} className="px-12 w-full md:w-auto">
                Place Order • ₹{subtotal.toFixed(2)}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
