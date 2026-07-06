import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '../ui';
import { useNavigate } from 'react-router-dom';

export default function EmptyOrders() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <PackageOpen className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        You haven't placed any orders yet. Browse our medicines and start shopping today.
      </p>
      <Button onClick={() => navigate('/medicines')} variant="primary" size="lg">
        Browse Medicines
      </Button>
    </div>
  );
}
