import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill, ShieldCheck, Layers, Truck, Search, SlidersHorizontal,
  ShoppingCart, Eye, Star, ChevronLeft, ChevronRight, Package, Filter
} from 'lucide-react';
import { medicineService, parseFrappeError } from '../../services';
import { ClayCard, Button, Select, Skeleton, StatusBadge } from '../../components/ui';
import AuthModal from '../../components/AuthModal';
import { useAuthStore } from '../../stores/useAuthStore';

// ─── KPI card ─────────────────────────────────────────────────
const kpiConfig = [
  { key: 'total_medicines', label: 'Total Medicines', icon: Pill, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  { key: 'available_medicines', label: 'Available Now', icon: ShieldCheck, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  { key: 'medicine_categories', label: 'Categories', icon: Layers, color: 'violet', bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
  { key: 'same_day_delivery', label: 'Same-Day Delivery', icon: Truck, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', format: (v) => v ? 'Available' : 'N/A' },
];

const KpiCard = ({ label, value, icon: Icon, bg, text, border }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <ClayCard className={`flex items-center gap-4 p-5 border ${border}`}>
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${text}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${text}`}>{value ?? '—'}</p>
      </div>
    </ClayCard>
  </motion.div>
);

// ─── Medicine Card ────────────────────────────────────────────
const stockStatus = (qty) => {
  if (!qty || qty <= 0) return 'Out of Stock';
  if (qty <= 10) return 'Low Stock';
  return 'In Stock';
};

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='40' fill='%2394a3b8'%3E💊%3C/text%3E%3C/svg%3E";

function MedicineCard({ medicine, onBuyNow }) {
  const status = stockStatus(medicine.current_stock);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
    >
      <ClayCard className="flex flex-col h-full overflow-hidden group">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 rounded-xl m-3 mb-0">
          <img
            src={medicine.image ? (medicine.image.startsWith('http') || medicine.image.startsWith('/') ? medicine.image : `/${medicine.image}`) : PLACEHOLDER_IMG}
            alt={medicine.medicine_name}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          />
          {medicine.category && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-700 shadow-sm">
              {medicine.category}
            </span>
          )}
          <div className="absolute top-2 right-2">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1">{medicine.medicine_name}</h3>
            {medicine.generic_name && (
              <p className="text-xs text-gray-500 mt-0.5">Generic: {medicine.generic_name}</p>
            )}
            {medicine.brand && (
              <p className="text-xs text-gray-400">Brand: {medicine.brand}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-blue-700">
              ₹{parseFloat(medicine.selling_price || 0).toFixed(2)}
            </span>
            {medicine.mrp && parseFloat(medicine.mrp) > parseFloat(medicine.selling_price) && (
              <span className="text-xs line-through text-gray-400">₹{parseFloat(medicine.mrp).toFixed(2)}</span>
            )}
          </div>

          {/* Stars placeholder */}
          <div className="flex gap-0.5 mt-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-3">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Details
            </Button>
            <Button
              variant={status === 'Out of Stock' ? 'secondary' : 'primary'}
              size="sm"
              className="flex-1 gap-1.5"
              disabled={status === 'Out of Stock'}
              onClick={() => onBuyNow(medicine)}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {status === 'Out of Stock' ? 'Unavailable' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </ClayCard>
    </motion.div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────
function MedicineCardSkeleton() {
  return (
    <ClayCard className="flex flex-col overflow-hidden">
      <Skeleton className="h-44 m-3 mb-0 rounded-xl" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3 mt-2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 flex-1 rounded-xl" />
        </div>
      </div>
    </ClayCard>
  );
}

// ─── Category pill ────────────────────────────────────────────
function CategoryPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-600 shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_5px_#ffffff] hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Main HomePage ────────────────────────────────────────────
export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [authModal, setAuthModal] = useState({ open: false, pendingMedicine: null });
  const [filters, setFilters] = useState({
    search: '', category: '', brand: '', availability: '', sort: 'name', page: 1,
  });
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // KPI stats
  const { data: stats } = useQuery({
    queryKey: ['portalStats'],
    queryFn: medicineService.getPortalStats,
    staleTime: 60_000,
  });

  // Filter options
  const { data: filterOptions } = useQuery({
    queryKey: ['medicineFilters'],
    queryFn: medicineService.getFilters,
    staleTime: 300_000,
  });

  // Medicine list
  const { data: medicineData, isLoading } = useQuery({
    queryKey: ['medicines', filters],
    queryFn: () => medicineService.getList(filters),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const medicines = medicineData?.medicines || [];
  const total = medicineData?.total || 0;
  const pageSize = filters.page_size || 12;
  const totalPages = Math.ceil(total / pageSize);

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const handleSearch = (e) => {
    e.preventDefault();
    set('search', searchInput);
  };

  const handleBuyNow = (medicine) => {
    if (!isAuthenticated) {
      setAuthModal({ open: true, pendingMedicine: medicine });
    } else {
      // TODO: add to cart / proceed to purchase
      alert(`Added ${medicine.medicine_name} to cart! (cart integration coming next)`);
    }
  };

  const onAuthSuccess = () => {
    if (authModal.pendingMedicine) {
      alert(`Added ${authModal.pendingMedicine.medicine_name} to cart!`);
      setAuthModal({ open: false, pendingMedicine: null });
    }
  };

  return (
    <div className="space-y-8 pb-12">

      {/* ── KPI Cards ── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiConfig.map((k, i) => (
            <motion.div key={k.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <KpiCard
                label={k.label}
                value={k.format ? k.format(stats?.[k.key]) : stats?.[k.key]}
                icon={k.icon}
                bg={k.bg}
                text={k.text}
                border={k.border}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Category pills ── */}
      {filterOptions?.categories?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Browse by Category</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <CategoryPill label="All" active={!filters.category} onClick={() => set('category', '')} />
            {filterOptions.categories.map(cat => (
              <CategoryPill key={cat} label={cat} active={filters.category === cat} onClick={() => set('category', cat)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Search & Filters bar ── */}
      <section>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search medicines, generics…"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-100 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-1px_-1px_4px_#ffffff] text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <Button type="submit" variant="primary" size="md">Search</Button>
          </form>

          {/* Filter toggle */}
          <Button variant="secondary" size="md" onClick={() => setShowFilters(v => !v)} className="gap-2 shrink-0">
            <Filter className="w-4 h-4" /> Filters {showFilters ? '▲' : '▼'}
          </Button>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <Select value={filters.brand} onChange={e => set('brand', e.target.value)}>
                  <option value="">All Brands</option>
                  {(filterOptions?.brands || []).map(b => <option key={b} value={b}>{b}</option>)}
                </Select>

                <Select value={filters.availability} onChange={e => set('availability', e.target.value)}>
                  <option value="">All Availability</option>
                  <option value="in_stock">In Stock Only</option>
                </Select>

                <Select value={filters.sort} onChange={e => set('sort', e.target.value)}>
                  <option value="name">Sort: Name A–Z</option>
                  <option value="price_asc">Sort: Price ↑</option>
                  <option value="price_desc">Sort: Price ↓</option>
                  <option value="newest">Sort: Newest</option>
                </Select>

                <Button variant="ghost" size="md" onClick={() => { setFilters({ search:'', category:'', brand:'', availability:'', sort:'name', page:1 }); setSearchInput(''); }}>
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Medicine Grid ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            {filters.category ? filters.category : 'All Medicines'}
            {!isLoading && <span className="text-sm font-normal text-gray-400">({total} found)</span>}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <MedicineCardSkeleton key={i} />)}
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💊</div>
            <h3 className="text-lg font-semibold text-gray-700">No medicines found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(filters)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {medicines.map(med => (
                <MedicineCard key={med.name} medicine={med} onBuyNow={handleBuyNow} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button
              variant="secondary" size="sm"
              disabled={filters.page <= 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 font-medium">
              Page {filters.page} of {totalPages}
            </span>
            <Button
              variant="secondary" size="sm"
              disabled={filters.page >= totalPages}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </section>

      {/* ── Auth Modal ── */}
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ open: false, pendingMedicine: null })}
        onSuccess={onAuthSuccess}
        defaultTab="login"
      />
    </div>
  );
}
