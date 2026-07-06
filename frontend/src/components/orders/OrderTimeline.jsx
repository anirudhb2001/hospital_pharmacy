import React from 'react';
import { cn } from '../ui';
import { CheckCircle2, Clock, Truck, Package, PackageCheck, XCircle } from 'lucide-react';

export default function OrderTimeline({ currentStatus }) {
  const steps = [
    { id: 'Placed', label: 'Order Placed', icon: Clock },
    { id: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { id: 'Processing', label: 'Processing', icon: Package },
    { id: 'Packed', label: 'Packed', icon: PackageCheck },
    { id: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  if (currentStatus === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <XCircle className="w-6 h-6 text-red-500" />
        <div>
          <h4 className="font-semibold text-red-700">Order Cancelled</h4>
          <p className="text-sm text-red-600">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === currentStatus);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="relative py-4">
      {/* Background Line */}
      <div className="absolute top-8 left-4 bottom-8 w-0.5 bg-gray-100 md:top-6 md:left-8 md:right-8 md:h-0.5 md:w-auto md:bottom-auto z-0" />
      
      {/* Active Line (Desktop) */}
      <div 
        className="hidden md:block absolute top-6 left-8 h-0.5 bg-blue-600 z-0 transition-all duration-500" 
        style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 4rem)' }}
      />
      
      {/* Active Line (Mobile) */}
      <div 
        className="md:hidden absolute top-8 left-4 w-0.5 bg-blue-600 z-0 transition-all duration-500" 
        style={{ height: `${(activeIndex / (steps.length - 1)) * 100}%`, maxHeight: 'calc(100% - 4rem)' }}
      />

      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-2 relative z-10">
        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isActive = index === activeIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2 relative">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300",
                  isCompleted ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-300",
                  isActive && "ring-4 ring-blue-100"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span 
                className={cn(
                  "text-sm font-medium",
                  isCompleted ? "text-gray-900" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
