export const dynamic = "force-dynamic"; // ✅ Refresh par database se fresh status uthayega

import { prisma } from "@/lib/prisma"; // ✅ Shared prisma instance
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatusDropdown from "@/components/StatusDropdown"; 

export default async function SellerOrders() {
  const session = await getServerSession(authOptions);
  
  // 🛡️ Security: Check if session exists
  if (!session?.user) {
    return <div className="p-8 font-black text-red-500">Please login to view orders. ❌</div>;
  }

  const sellerId = (session.user as any).id;

  // 🔍 Fetch only orders that contain this seller's products
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: { product: { sellerId: sellerId } }
      }
    },
    include: { 
      user: true,
      items: { include: { product: true } } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">My Shop Orders 📦</h1>
        <p className="text-gray-500 text-sm">Track and manage status for orders specifically for your products.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Current Status</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Update Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-blue-50/10 transition group">
                {/* 1. Order ID */}
                <td className="p-5">
                  <span className="font-mono font-bold text-gray-600">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </td>

                {/* 2. Customer Info */}
                <td className="p-5">
                  <p className="font-bold text-gray-900">{order.user.name}</p>
                  <p className="text-[10px] text-gray-400">{order.user.email}</p>
                </td>

                {/* 3. Pricing */}
                <td className="p-5 font-black text-gray-900">
                  ₹{order.total.toLocaleString()}
                </td>

                {/* 4. Database Status Badge */}
                <td className="p-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
          order.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
          order.status === "DELIVERED" ? "bg-green-50 text-green-700 border-green-100" :
          "bg-blue-50 text-blue-700 border-blue-100"
        }`}>
          {order.status} {/* 👈 "SOLD" ki jagah ye database wala status dikhayega */}
        </span>
      </td>

      {/* 👇 YAHAN DROPDOWN DALO: Taaki vendor status badal sake */}
      <td className="p-5 text-right">
        <StatusDropdown orderId={order.id} currentStatus={order.status} />
      </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-bold text-lg">No orders found for your shop yet. 🛒</p>
          </div>
        )}
      </div>
    </div>
  );
}