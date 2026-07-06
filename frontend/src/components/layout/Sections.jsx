import React from 'react';
import { Button, Card, SectionTitle } from '../ui';
import { FileText, Camera, Upload, CheckCircle2, Stethoscope, Activity, Truck, Bell, HeartPulse, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const PrescriptionBanner = () => {
  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_private', 1);

    try {
      const response = await fetch('/api/method/upload_file', {
        method: 'POST',
        headers: {
          'X-Frappe-CSRF-Token': window.csrf_token || ''
        },
        body: formData
      });
      const data = await response.json();
      if (data.message) {
        import('react-hot-toast').then(({ toast }) => toast.success('Prescription Uploaded Successfully! Our team will verify it shortly.'));
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      import('react-hot-toast').then(({ toast }) => toast.error('Failed to upload prescription.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section id="prescription-banner" className="mb-24 relative overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/20">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      <div className="relative px-8 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-xl text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Order with Prescription</h2>
          <p className="text-blue-100 text-lg font-medium mb-10 leading-relaxed">
            Upload your prescription and let our pharmacists do the rest. Get your medicines delivered quickly and safely.
          </p>
          <ul className="space-y-4 mb-10">
            {['100% Secure & Confidential', 'Verified by Expert Pharmacists', 'Free Home Delivery'].map(item => (
              <li key={item} className="flex items-center gap-3 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {item}
              </li>
            ))}
          </ul>
          
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} accept="image/*,.pdf" />
          <Button variant="secondary" size="lg" className="shadow-xl" onClick={() => fileInputRef.current?.click()} isLoading={uploading}>
            <Upload className="w-5 h-5" /> {uploading ? 'Uploading...' : 'Upload Prescription Now'}
          </Button>
        </div>
        <div className="flex-1 hidden md:flex justify-end">
          <div className="relative w-80 h-80 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center p-8">
            <div className="w-full h-full bg-white rounded-full shadow-2xl flex flex-col items-center justify-center text-blue-600 gap-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => fileInputRef.current?.click()}>
              <Camera className="w-16 h-16" />
              <span className="font-extrabold text-xl">Scan to Upload</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ServicesSection = () => {
  const services = [
    { title: 'Doctor Consult', desc: 'Online consultation 24/7', icon: Stethoscope, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { title: 'Lab Tests', desc: 'Sample collection at home', icon: Activity, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'Express Delivery', desc: 'Under 2 hours delivery', icon: Truck, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'Medicine Reminder', desc: 'Never miss a dose', icon: Bell, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  return (
    <section className="mb-24">
      <SectionTitle title="Healthcare Services" subtitle="Comprehensive care tailored for you" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(s => (
          <Card key={s.title} hover className="p-8 flex flex-col items-center text-center group">
            <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center border shadow-inner mb-6 transition-transform group-hover:scale-110 duration-300 ${s.color}`}>
              <s.icon className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-800 mb-2">{s.title}</h3>
            <p className="text-slate-500 font-medium">{s.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export const Testimonials = () => {
  const reviews = [
    { name: 'Sarah Jenkins', role: 'Verified Patient', text: 'The express delivery is a lifesaver. I received my emergency asthma inhaler within 45 minutes of ordering. Absolutely premium service!', rating: 5 },
    { name: 'David Chen', role: 'Regular Customer', text: 'I love the interface and how easy it is to find my cardiac medicines. The genuine product guarantee gives me peace of mind.', rating: 5 },
    { name: 'Priya Sharma', role: 'Verified Patient', text: 'The pharmacist consultation feature before buying was extremely helpful. The packaging is always secure and tamper-proof.', rating: 5 },
  ];

  return (
    <section className="mb-24">
      <SectionTitle title="What Our Patients Say" subtitle="Trusted by thousands of families" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <motion.div key={i} whileHover={{ y: -8 }}>
            <Card className="p-8 h-full flex flex-col">
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-600 font-medium text-lg leading-relaxed flex-1 mb-8">"{r.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 border-2 border-white shadow-sm" />
                <div>
                  <h4 className="font-bold text-slate-900">{r.name}</h4>
                  <p className="text-sm font-semibold text-blue-600">{r.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
