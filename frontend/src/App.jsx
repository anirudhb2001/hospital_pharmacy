import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { FrappeProvider } from 'frappe-react-sdk';

// Layouts
const PortalLayout = () => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Hospital Pharmacy</h1>
      <nav>
        <Link to="/" className="mr-4 hover:underline">Home</Link>
        <Link to="/medicines" className="mr-4 hover:underline">Medicines</Link>
        <Link to="/cart" className="mr-4 hover:underline">Cart</Link>
        <Link to="/admin" className="hover:underline">Admin Login</Link>
      </nav>
    </header>
    <main className="flex-grow p-4">
      <Outlet />
    </main>
    <footer className="bg-gray-800 text-white text-center p-4">
      &copy; 2026 Hospital Pharmacy
    </footer>
  </div>
);

const AdminLayout = () => (
  <div className="min-h-screen flex bg-gray-100">
    <aside className="w-64 bg-gray-900 text-white hidden md:block">
      <div className="p-4 text-xl font-bold border-b border-gray-700">Admin Panel</div>
      <nav className="p-4 space-y-2">
        <Link to="/admin" className="block py-2 px-4 rounded hover:bg-gray-800">Dashboard</Link>
        <Link to="/admin/medicines" className="block py-2 px-4 rounded hover:bg-gray-800">Medicines</Link>
        <Link to="/admin/sales" className="block py-2 px-4 rounded hover:bg-gray-800">Sales</Link>
        <Link to="/admin/purchases" className="block py-2 px-4 rounded hover:bg-gray-800">Purchases</Link>
        <Link to="/admin/stock" className="block py-2 px-4 rounded hover:bg-gray-800">Stock</Link>
        <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-800 mt-8 text-blue-400">View Portal</Link>
      </nav>
    </aside>
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
            <input type="text" placeholder="Global Search..." className="px-3 py-1 border rounded-md" />
            <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center">A</div>
        </div>
      </header>
      <main className="p-6 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

// Pages
const Home = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold mb-4">Welcome to our Online Pharmacy</h1>
    <p className="text-gray-600 mb-8">Order medicines online, upload prescriptions, and get them delivered to your hospital bed or home.</p>
    <Link to="/medicines" className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">Browse Medicines</Link>
  </div>
);

const MedicineList = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Medicine Catalog</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {/* Placeholder for medicines */}
       <div className="border p-4 rounded shadow-sm bg-white">
          <h3 className="font-bold">Paracetamol 500mg</h3>
          <p className="text-gray-600 text-sm">Pain relief</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-lg">$5.00</span>
            <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded">Add to Cart</button>
          </div>
       </div>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
       <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
         <h3 className="text-gray-500 text-sm font-medium">Today's Sales</h3>
         <p className="text-3xl font-bold mt-2">$1,240</p>
       </div>
       <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
         <h3 className="text-gray-500 text-sm font-medium">Orders Pending</h3>
         <p className="text-3xl font-bold mt-2">14</p>
       </div>
       <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
         <h3 className="text-gray-500 text-sm font-medium">Low Stock</h3>
         <p className="text-3xl font-bold mt-2">8</p>
       </div>
       <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
         <h3 className="text-gray-500 text-sm font-medium">Expired</h3>
         <p className="text-3xl font-bold mt-2">2</p>
       </div>
    </div>
  </div>
);

function App() {
  const getSiteName = () => {
    if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('14'))) {
      return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME;
    }
    return import.meta.env.VITE_SITE_NAME;
  };

  return (
    <FrappeProvider
      socketPort={import.meta.env.VITE_SOCKET_PORT}
      siteName={getSiteName()}
    >
      <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/frontend'}>
        <Routes>
          <Route path="/" element={<PortalLayout />}>
            <Route index element={<Home />} />
            <Route path="medicines" element={<MedicineList />} />
          </Route>
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="*" element={<div>Module under construction</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FrappeProvider>
  );
}

export default App;
