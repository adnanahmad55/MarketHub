"use client";
import { useEffect, useState } from "react";

export default function TopVendors() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetch("/api/admin/top-vendors").then(res => res.json()).then(setVendors);
  }, []);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900">Top Selling Vendors 🏆</h3>
        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase">Top Performers</span>
      </div>

      <div className="space-y-6">
        {vendors.map((vendor: any, index) => (
          <div key={index} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                #{index + 1}
              </div>
              <div>
                <p className="font-black text-gray-900 text-base">{vendor.name}</p>
                <p className="text-xs font-bold text-gray-400">{vendor.salesCount} products sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-emerald-600 text-lg">₹{vendor.revenue.toLocaleString()}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}