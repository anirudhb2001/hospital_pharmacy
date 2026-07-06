import React from 'react';
import { Pill, Syringe, Baby, Heart, Activity, Apple, Thermometer, Droplets } from 'lucide-react';
import { CategoryCard, SectionTitle } from '../ui';

export const CategorySection = ({ onSelectCategory }) => {
  const categories = [
    { name: 'Tablet', icon: Pill, color: 'bg-blue-50 text-blue-600' },
    { name: 'Capsule', icon: Activity, color: 'bg-amber-50 text-amber-600' },
    { name: 'Syrup', icon: Droplets, color: 'bg-cyan-50 text-cyan-600' },
    { name: 'Injection', icon: Syringe, color: 'bg-rose-50 text-rose-600' },
    { name: 'Ointment', icon: Heart, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Drops', icon: Baby, color: 'bg-purple-50 text-purple-600' },
    { name: 'Cream', icon: Apple, color: 'bg-lime-50 text-lime-600' },
    { name: 'Powder', icon: Thermometer, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <section className="mb-20">
      <SectionTitle title="Shop By Category" subtitle="Explore our wide range of premium healthcare products" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryCard 
            key={cat.name} 
            category={cat.name} 
            icon={cat.icon} 
            colorClass={cat.color} 
            onClick={() => onSelectCategory(cat.name)}
          />
        ))}
      </div>
    </section>
  );
};
