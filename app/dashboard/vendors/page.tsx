"use client";

import { useState, useEffect } from "react";

export default function VendorsPage() {
  // 👈 Fix: Yahan <any[]> add kiya hai taaki 'never[]' error na aaye
  const [vendors, setVendors] = useState<any[]>([]); 
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // 1. Vendors Load Karo
  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => {
        setVendors(data);
      })
      .catch((err) => console.error("Error loading vendors:", err));
  }, []);

  // 2. 🛡️ Status Toggle Logic
  const handleToggle = async (id: string, field: string, currentValue: boolean) => {
    // API path ko backend ke logic se sync rakho
    const res = await fetch(`/api/admin/vendors/${id}`, { 
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !currentValue }), 
    });

    if (res.ok) {
      setVendors(vendors.map((v: any) => 
        v.id === id ? { ...v, [field]: !currentValue } : v
      ));
    } else {
      alert("Failed to update status ❌ - Backend path check karo!");
    }
  };
  // 3. Naya Vendor Add Karo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Vendor Added ✅");
      window.location.reload(); 
    } else {
      alert("Error adding vendor ❌");
    }
    setLoading(false);
  };

  // 4. Vendor DELETE Function
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;

    const res = await fetch("/api/vendors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      alert("Vendor Deleted Successfully! 🗑️");
      setVendors(vendors.filter((v: any) => v.id !== id));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-black mb-10 text-gray-900 tracking-tight">Manage Vendors 👥</h2>

      {/* Add Vendor Form */}
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 mb-12 border border-gray-100">
        <h3 className="text-xl font-black mb-6 text-gray-900">Add New Shop</h3>
        <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap gap-4 items-end">
          <div className="w-full">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Shop Name</label>
            <input 
              type="text" placeholder="e.g. Mughal Bangles" required 
              className="w-full bg-gray-50 border-none p-3 rounded-xl text-black font-bold focus:ring-2 focus:ring-blue-500/20"
              value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="w-full">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Email</label>
            <input 
              type="email" placeholder="vendor@shop.com" required 
              className="w-full bg-gray-50 border-none p-3 rounded-xl text-black font-bold focus:ring-2 focus:ring-blue-500/20"
              value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>
          <div className="w-full">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Password</label>
            <input 
              type="password" placeholder="******" required 
              className="w-full bg-gray-50 border-none p-3 rounded-xl text-black font-bold focus:ring-2 focus:ring-blue-500/20"
              value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-black shadow-lg shadow-blue-100 transition h-[48px]">
            {loading ? "Adding..." : "+ Add"}
          </button>
        </form>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase">Vendor Info</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase text-center">Trust Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase text-center">Account</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vendors.map((vendor: any) => (
              <tr key={vendor.id} className={`hover:bg-blue-50/20 transition ${vendor.isBlocked ? 'opacity-60 grayscale' : ''}`}>
                <td className="px-6 py-5">
                  <p className="text-gray-900 font-black text-lg">{vendor.name}</p>
                  <p className="text-sm font-bold text-blue-600/60">{vendor.email}</p>
                </td>
                <td className="px-6 py-5 text-center">
                  <button 
                    onClick={() => handleToggle(vendor.id, 'isVerified', vendor.isVerified)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition ${
                      vendor.isVerified 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}
                  >
                    {vendor.isVerified ? 'Verified ✓' : 'Verify Vendor'}
                  </button>
                </td>
                <td className="px-6 py-5 text-center">
                  <button 
                    onClick={() => handleToggle(vendor.id, 'isBlocked', vendor.isBlocked)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition ${
                      vendor.isBlocked 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {vendor.isBlocked ? 'Blocked 🚫' : 'Active ✅'}
                  </button>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => handleDelete(vendor.id)}
                    className="text-red-500 hover:text-red-700 font-black text-xs uppercase"
                  >
                    Delete Account
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}