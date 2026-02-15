export const dynamic = "force-dynamic"; // ✅ Refresh par status update lock karne ke liye

import { prisma } from "@/lib/prisma"; // ✅ Sahi rasta: Ab prisma conflict nahi karega
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatusDropdown from "@/components/StatusDropdown"; 

export default async function SellerOrders() {
  const session = await getServerSession(authOptions);
  
  // 🛡️ User logged in hai ya nahi check karo
  if (!session?.user) {
    return <div className="p-8 font-black text-red-500">Please login to view orders.</div>;
  }

  const sellerId = (session.user as any).id;

  // 🔍 Sirf is seller ke products waale orders fetch ho rahe hain
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: { product: { sellerId: sellerId } }
      }
    },
    include: { 
      user: true,
      items: { include: { product: true } } // Details ke liye products bhi le liye
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">My Shop Orders 📦</h1>
        <p className="text-gray-500 text-sm">Manage orders specifically for your products.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-blue-50/10 transition group">
                <td className="p-5">
                  <span className="font-mono font-bold text-gray-600">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </td>
                <td className="p-5">
                  <p className="font-bold text-gray-900">{order.user.name}</p>
                  <p className="text-[10px] text-gray-400">{order.user.email}</p>
                </td>
                <td className="p-5 font-black text-gray-900">
                  ₹{order.total.toLocaleString()}
                </td>
                <td className="p-5 text-right">
                  {/* Status Dropdown jo database update karega */}
                  <StatusDropdown orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="p-10 text-center text-gray-400 font-bold">
            No orders found for your products yet.
          </div>
        )}
      </div>
    </div>
  );
}