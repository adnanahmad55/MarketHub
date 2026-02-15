"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StatusDropdown({ orderId, currentStatus }: any) {
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (newStatus: string) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus} ✅`);
    } else {
      toast.error("Update failed! ❌");
    }
  };

  return (
    <select 
      value={status} 
      onChange={(e) => handleStatusChange(e.target.value)}
      className="bg-gray-50 border-none p-2 rounded-xl font-bold text-xs uppercase"
    >
      <option value="PENDING">Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}