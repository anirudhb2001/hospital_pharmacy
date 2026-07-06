import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { ShieldCheck, HeartPulse, Stethoscope, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-white rounded-[40px] shadow-[12px_12px_24px_#e2e8f0,-12px_-12px_24px_#ffffff] mb-12 border border-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-40 -right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-20 right-20 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      
      <div className="relative px-8 md:px-16 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Content */}
        <div className="flex-1 max-w-2xl z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> 100% Secure & Trusted
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Our Priority.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 leading-relaxed max-w-xl">
              Get genuine medicines and healthcare products delivered securely to your doorstep. Premium care for you and your family.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => {
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => window.scrollTo({ top: document.getElementById('medicine-grid')?.offsetTop - 100, behavior: 'smooth' }), 100);
                } else {
                  window.scrollTo({ top: document.getElementById('medicine-grid')?.offsetTop - 100, behavior: 'smooth' });
                }
              }} className="shadow-[0_8px_20px_rgba(37,99,235,0.3)]">
                Shop Medicines <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => {
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => window.scrollTo({ top: document.getElementById('prescription-banner')?.offsetTop - 100, behavior: 'smooth' }), 100);
                } else {
                  window.scrollTo({ top: document.getElementById('prescription-banner')?.offsetTop - 100, behavior: 'smooth' });
                }
              }} className="shadow-[4px_4px_10px_#e2e8f0,-4px_-4px_10px_#ffffff]">
                Upload Prescription
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-8">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm" />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-500"><span className="text-slate-900 text-base">50k+</span><br/>Happy Customers</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Graphics */}
        <div className="flex-1 relative w-full h-[400px] hidden md:flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10 w-[80%] h-[80%] bg-white rounded-[40px] shadow-[20px_20px_40px_rgba(203,213,225,0.4),-20px_-20px_40px_rgba(255,255,255,1)] border border-white flex items-center justify-center"
          >
            {/* Abstract Premium Illustration (CSS based) */}
            <div className="w-48 h-48 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-full blur-xl opacity-40 absolute -top-10 -left-10" />
            <div className="w-48 h-48 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full blur-xl opacity-40 absolute -bottom-10 -right-10" />
            
            <div className="relative z-20 flex flex-col gap-6">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="w-64 p-5 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><HeartPulse className="w-6 h-6" /></div>
                <div><h4 className="font-extrabold text-slate-800">Health Monitor</h4><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</p></div>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="w-64 p-5 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white flex items-center gap-4 ml-12">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><Stethoscope className="w-6 h-6" /></div>
                <div><h4 className="font-extrabold text-slate-800">Expert Doctors</h4><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available</p></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
