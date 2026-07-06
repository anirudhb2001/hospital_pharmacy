import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Camera, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-black">Rx</span>
              </div>
              <span className="font-black text-slate-900 text-lg tracking-tight">Hospital Pharmacy</span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Your trusted premium online pharmacy. Providing genuine medicines and healthcare products with fast delivery.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                <Camera className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><Link to="/medicines" className="hover:text-blue-600 transition-colors">All Medicines</Link></li>
              <li><Link to="/orders" className="hover:text-blue-600 transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-blue-600 transition-colors">Shopping Cart</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Upload Prescription</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Offers & Discounts</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Top Categories</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Diabetes Care</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Cardiac Care</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Stomach Care</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Vitamins & Supplements</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Baby Care</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>123 Hospital Road, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                <span>support@hospitalpharmacy.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-400">
          <p>© 2026 Hospital Pharmacy. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <Link to="/admin/login" className="hover:text-blue-600 transition-colors">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
