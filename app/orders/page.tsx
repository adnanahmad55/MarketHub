"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-lg font-bold text-gray-800 animate-pulse">Fetching your orders... 📦</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Title - Ab ekdum dark aur sharp dikhega */}
        <h1 className="text-4xl font-black text-gray-900 mb-10 flex items-center gap-3">
          My Purchase History 📜
        </h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
             <p className="text-gray-500 text-xl font-medium">No orders found yet. 🛍️</p>
             <Link href="/" className="text-blue-600 font-bold mt-4 inline-block underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                {/* Order Header */}
                <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order ID</p>
                    <p className="font-mono text-sm text-blue-600 font-bold">#{order.id.slice(-8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Placed On</p>
                    <p className="text-sm font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 space-y-6">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-6">
                      <div className="h-20 w-20 relative rounded-2xl overflow-hidden border bg-gray-50 flex-shrink-0">
                        <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-gray-900 text-lg">{item.product.name}</p>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{item.product.category}</p>
                        <p className="text-sm font-medium text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    order.status === 'COMPLETED' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {order.status}
                  </span>
                  <div className="text-right flex items-center gap-3">
                    <p className="text-gray-400 font-bold uppercase text-xs">Total Amount:</p>
                    <p className="text-3xl font-black text-gray-900">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}