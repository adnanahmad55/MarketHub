"use client";
import { useState } from "react";

export default function OrderStatusDropdown({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
    } else {
      alert("Failed to update status!");
    }
    setLoading(false);
  };

  return (
    <select 
      value={status}
      disabled={loading}
      onChange={(e) => handleStatusChange(e.target.value)}
      className={`p-2 rounded-xl font-black text-[10px] uppercase border transition cursor-pointer ${
        status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
        status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
        'bg-blue-50 text-blue-700 border-blue-200'
      }`}
    >
      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}