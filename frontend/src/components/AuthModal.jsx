import React, { useState } from 'react';
import { Modal, Input, Button } from './ui';
import { useAuthStore } from '../stores/useAuthStore';
import { authService, parseFrappeError } from '../services';

const TABS = ['login', 'register'];

export default function AuthModal({ isOpen, onClose, onSuccess, defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const f = e.target;

    try {
      if (tab === 'login') {
        const res = await authService.customerLogin(f.email.value, f.password.value);
        login(res.user, res.full_name, false);
        onClose();
        onSuccess?.();
      } else {
        if (f.password.value !== f.confirm.value) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        await authService.register(f.full_name.value, f.email.value, f.phone.value, f.password.value);
        // Auto-login after registration
        const res = await authService.customerLogin(f.email.value, f.password.value);
        login(res.user, res.full_name, false);
        onClose();
        onSuccess?.();
      }
    } catch (err) {
      setError(parseFrappeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {tab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                tab === t ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <>
              <Input name="full_name" type="text" placeholder="Full Name" label="Full Name" required />
              <Input name="phone" type="tel" placeholder="Phone Number" label="Phone" required />
            </>
          )}
          <Input name="email" type="email" placeholder="you@email.com" label="Email Address" required />
          <Input name="password" type="password" placeholder="Password" label="Password" required />
          {tab === 'register' && (
            <Input name="confirm" type="password" placeholder="Confirm Password" label="Confirm Password" required />
          )}

          <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full mt-2">
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-blue-600 font-semibold hover:underline"
          >
            {tab === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </Modal>
  );
}
