import React from 'react';
import { Pill, ShieldCheck, Layers, Truck } from 'lucide-react';
import { StatsCard } from '../ui';

export const KPICards = ({ stats, isLoading }) => {
  if (isLoading) return null; // Can render skeletons here if needed
  
  const kpiData = [
    { key: 'total_medicines', label: 'Total Medicines', icon: Pill, colorClass: 'bg-blue-50 text-blue-600', val: stats?.total_medicines || '1,200+' },
    { key: 'available_medicines', label: 'Available Now', icon: ShieldCheck, colorClass: 'bg-emerald-50 text-emerald-600', val: stats?.available_medicines || '1,150+' },
    { key: 'medicine_categories', label: 'Categories', icon: Layers, colorClass: 'bg-violet-50 text-violet-600', val: stats?.medicine_categories || '45+' },
    { key: 'same_day_delivery', label: 'Fast Delivery', icon: Truck, colorClass: 'bg-amber-50 text-amber-600', val: '24 Hrs' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-20 -mt-20 px-8">
      {kpiData.map((kpi) => (
        <StatsCard key={kpi.key} label={kpi.label} value={kpi.val} icon={kpi.icon} colorClass={kpi.colorClass} />
      ))}
    </div>
  );
};
