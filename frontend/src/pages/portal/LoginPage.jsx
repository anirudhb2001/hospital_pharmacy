import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { api } from '../../api';
import { cn } from '../../components/ui';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('customer'); // customer, staff, register
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // If user came from an admin route redirect, default to staff tab
  React.useEffect(() => {
    if (location.pathname === '/admin/login') {
      setActiveTab('staff');
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      if (activeTab === 'customer') {
        const res = await api.post('/api/method/hospital_pharmacy.api.customer_login', { email: data.email, password: data.password });
        if(res.data.message.status === 'success') {
          login(res.data.message.user, res.data.message.full_name, false);
          navigate('/');
        }
      } else if (activeTab === 'staff') {
        const res = await api.post('/api/method/hospital_pharmacy.api.admin_login', { email: data.email, password: data.password });
        if(res.data.message.status === 'success') {
          login(res.data.message.user, res.data.message.full_name, true);
          navigate('/admin');
        }
      } else if (activeTab === 'register') {
        const res = await api.post('/api/method/hospital_pharmacy.api.register_customer', { 
          full_name: data.full_name, 
          email: data.email, 
          phone: data.phone,
          password: data.password 
        });
        if(res.data.message.status === 'success') {
          alert("Registration successful. Please login.");
          setActiveTab('customer');
        }
      }
    } catch (error) {
      let errorMsg = 'Authentication failed';
      if (error.response?.data?._server_messages) {
        try {
          const messages = JSON.parse(error.response.data._server_messages);
          errorMsg = JSON.parse(messages[0]).message || errorMsg;
        } catch (e) {
          errorMsg = error.response.data.exc_type || errorMsg;
        }
      } else {
        errorMsg = error.response?.data?.exc_type || errorMsg;
      }
      alert(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-white rounded-3xl shadow-clay p-8 w-full max-w-md border border-white">
        
        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-gray-50 p-1.5 rounded-xl shadow-clay-inset">
          <button 
            type="button"
            onClick={() => setActiveTab('customer')}
            className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", activeTab === 'customer' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700")}
          >
            Customer
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('staff')}
            className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", activeTab === 'staff' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700")}
          >
            Staff
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('register')}
            className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", activeTab === 'register' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700")}
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          {activeTab === 'customer' && 'Customer Login'}
          {activeTab === 'staff' && 'Staff Portal'}
          {activeTab === 'register' && 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input name="full_name" type="text" required className="w-full px-4 py-3 rounded-xl bg-background shadow-clay-inset focus:ring-2 focus:ring-primary outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input name="phone" type="tel" required className="w-full px-4 py-3 rounded-xl bg-background shadow-clay-inset focus:ring-2 focus:ring-primary outline-none text-sm" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address or Username</label>
            <input name="email" type="text" required className="w-full px-4 py-3 rounded-xl bg-background shadow-clay-inset focus:ring-2 focus:ring-primary outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl bg-background shadow-clay-inset focus:ring-2 focus:ring-primary outline-none text-sm" />
          </div>

          <button type="submit" className="w-full mt-4 bg-primary text-white py-3 rounded-xl shadow-clay font-medium hover:-translate-y-0.5 transition">
            {activeTab === 'register' ? 'Register Account' : 'Sign In securely'}
          </button>
        </form>
      </div>
    </div>
  );
}
