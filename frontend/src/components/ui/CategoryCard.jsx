import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './index';
import { ChevronRight } from 'lucide-react';

export const CategoryCard = ({ category, icon: Icon, colorClass, onClick }) => {
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card hover className="p-6 cursor-pointer group flex items-center justify-between" onClick={onClick}>
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${colorClass}`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{category}</h3>
            <p className="text-sm font-medium text-slate-400 mt-0.5">Explore range</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </Card>
    </motion.div>
  );
};

export const StatsCard = ({ label, value, icon: Icon, colorClass }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card hover className="p-6 flex items-center gap-5">
        <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center shadow-inner ${colorClass}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
        </div>
      </Card>
    </motion.div>
  );
};
