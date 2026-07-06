import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { api } from './api';
import LoginPage from './pages/portal/LoginPage';

// Reusable Admin Guard
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  // Ensure the user is authenticated and is an admin role (we can check roles here if stored in state)
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
};

// Layouts
const PortalLayout = () => {
  const { isAuthenticated, logout } = useAuthStore();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-clay p-4 flex justify-between items-center rounded-b-2xl mb-8 border border-white">
        <h1 className="text-xl font-bold text-primary ml-4">Hospital Pharmacy</h1>
        <nav className="flex items-center space-x-6 mr-4">
          <Link to="/" className="text-gray-600 hover:text-primary font-medium transition">Home</Link>
          <Link to="/medicines" className="text-gray-600 hover:text-primary font-medium transition">Catalog</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-primary font-medium transition">Profile</Link>
              <button onClick={logout} className="text-danger font-medium hover:opacity-80 transition">Logout</button>
            </>
          ) : (
            <Link to="/login" className="bg-primary text-white px-5 py-2 rounded-xl font-medium shadow-clay hover:-translate-y-0.5 transition">Login</Link>
          )}
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 max-w-7xl">
        <Outlet />
      </main>
      <footer className="mt-12 py-8 text-center text-gray-500 text-sm">
        &copy; 2026 Hospital Pharmacy. All Rights Reserved.
      </footer>
    </div>
  );
};

const AdminLayout = () => {
  const { logout } = useAuthStore();
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-white m-4 rounded-2xl shadow-clay flex flex-col hidden md:flex border border-white">
        <div className="p-6 text-xl font-bold text-gray-800 border-b border-gray-100">Admin Portal</div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary transition font-medium">Dashboard</Link>
          <Link to="/admin/medicines" className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary transition font-medium">Medicines</Link>
          <Link to="/admin/inventory" className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary transition font-medium">Inventory</Link>
          <Link to="/admin/sales" className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary transition font-medium">Sales & Orders</Link>
          <Link to="/admin/analytics" className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary transition font-medium">Analytics</Link>
          
          <div className="mt-8 pt-4 border-t border-gray-100">
             <a href="/app" target="_blank" rel="noreferrer" className="block px-4 py-2.5 rounded-xl text-primary bg-primary/10 hover:bg-primary/20 transition font-medium">Open ERP Desk ↗</a>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100">
           <button onClick={logout} className="w-full py-2 text-danger font-medium hover:bg-danger/10 rounded-xl transition">Logout</button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col p-4 pl-0">
        <header className="bg-white rounded-2xl shadow-clay mb-4 p-4 flex justify-between items-center border border-white">
          <h2 className="text-lg font-bold text-gray-800 ml-2">Administration</h2>
          <div className="flex items-center space-x-4 mr-2">
            <div className="relative">
              <input type="text" placeholder="Global Search (Ctrl+K)" className="w-64 pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-none shadow-clay-inset focus:ring-2 focus:ring-primary text-sm outline-none" />
              <svg className="w-4 h-4 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">A</div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-clay p-6 border border-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Pages
const Home = () => (
  <div>
    <section className="bg-white rounded-3xl shadow-clay p-12 text-center my-8 border border-white relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Premium Healthcare, Delivered.</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Browse thousands of authentic medicines and wellness products with guaranteed fast delivery from our hospital pharmacy.</p>
        <Link to="/medicines" className="bg-primary text-white px-8 py-3 rounded-xl font-medium shadow-clay hover:-translate-y-1 transition inline-block">Shop Medicines</Link>
      </div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
    </section>
  </div>
);

const AdminDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {['Today\'s Revenue', 'Orders', 'Customers', 'Low Stock'].map((kpi, idx) => (
        <div key={idx} className="bg-gray-50 rounded-2xl p-6 shadow-clay-inset border border-white">
          <h3 className="text-sm font-medium text-gray-500">{kpi}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{Math.floor(Math.random() * 500) + 10}</p>
        </div>
      ))}
    </div>
  </div>
);

// Removed inline AdminLogin component

function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/frontend'}>
      <Routes>
        <Route path="/" element={<PortalLayout />}>
          <Route index element={<Home />} />
          <Route path="medicines" element={<div>Medicine Catalog Placeholder</div>} />
        </Route>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="*" element={<div className="text-gray-500">Module view rendering space.</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
