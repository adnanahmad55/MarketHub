"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SalesChart() {
  // 👈 Fix: any[] type add kiya taaki never[] error na aaye
  const [data, setData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/analytics")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-[300px] flex items-center justify-center text-gray-400 font-bold">
      Loading Stats... 📉
    </div>
  );

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#111827', fontSize: 12, fontWeight: '900' }} 
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: '#f3f4f6' }}
            // contentStyle use karna sahi hai
            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="sales" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.sales > 0 ? '#2563eb' : '#e5e7eb'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}