import React from 'react';
import { SectionTitle, ProductCard, Skeleton } from '../ui';
import { Filter, Search } from 'lucide-react';

export const MedicineGrid = ({ medicines, isLoading, onAddToCart, onBuyNow, onViewDetails, hasActiveFilters, onClearFilters }) => {
  return (
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <SectionTitle title="Featured Medicines" subtitle="Top rated products for your health needs" className="mb-0" />
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button onClick={onClearFilters} className="text-sm font-bold text-rose-500 hover:text-rose-600 px-3 py-2 transition-colors">
              Clear Filters
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-96" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicines.map(med => (
            <ProductCard 
              key={med.name} 
              medicine={med} 
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
      
      {!isLoading && medicines.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No medicines found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </section>
  );
};
