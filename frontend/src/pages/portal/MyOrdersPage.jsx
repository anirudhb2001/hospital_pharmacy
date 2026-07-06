import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { orderService } from '../../services';
import OrderCard from '../../components/orders/OrderCard';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import EmptyOrders from '../../components/orders/EmptyOrders';
import { Skeleton, Input, Select } from '../../components/ui';
import { AnimatePresence, motion } from 'framer-motion';

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Poll orders every 30 seconds for live updates
  const { data: response, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['myOrders'],
    queryFn: orderService.getOrders,
    refetchInterval: 30000, 
  });

  const orders = response?.orders || [];

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.items.some(item => (item.medicine_name || '').toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (statusFilter === 'All') return matchesSearch;
      if (statusFilter === 'Paid') return matchesSearch && order.payment_status === 'Paid';
      if (statusFilter === 'Unpaid') return matchesSearch && order.payment_status !== 'Paid';
      
      return matchesSearch && order.order_status === statusFilter;
    });
  }, [orders, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="w-48 h-10 mb-4" />
          <Skeleton className="w-full h-16" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-64 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (isError || response?.status === 'error') {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-500 mb-6">{response?.message || 'Failed to load orders. Please try again.'}</p>
        <button onClick={() => refetch()} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-gray-500 mt-1">Track, manage and reorder your medicines</p>
        </div>
        
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition px-4 py-2 bg-blue-50 rounded-lg shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by order ID or medicine..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="relative w-full sm:w-48 shrink-0">
              <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 transition appearance-none cursor-pointer"
              >
                <option value="All">All Orders</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredOrders.map(order => (
                  <motion.div
                    key={order.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <OrderCard order={order} onViewDetails={setSelectedOrder} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No orders match your filter criteria.</p>
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                className="mt-4 text-blue-600 font-semibold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyOrders />
      )}

      <OrderDetailsModal 
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
