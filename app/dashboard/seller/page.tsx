export const dynamic = "force-dynamic"; // ✅ Refresh par fresh data dikhayega

import { prisma } from "@/lib/prisma"; // ✅ Singleton prisma instance
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatusDropdown from "@/components/StatusDropdown"; 

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);
  
  // 🛡️ Error Fix: Pehle check karo session hai ya nahi (Line 10 ki red line isi se jayegi)
  if (!session?.user) {
    return <div className="p-8 font-black text-red-500">Please login to view dashboard. ❌</div>;
  }

  const sellerId = (session.user as any).id;

  // 🔍 Fetching latest 5 orders for this seller
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
    orderBy: { createdAt: 'desc' },
    take: 5 
  });

  return (
    <div className="p-8">
      {/* ... Aapke Stats Cards (Revenue etc.) yahan rahenge ... */}

      <div className="mt-10">
        <h2 className="text-xl font-black text-gray-900 mb-6">📦 Recent Sales</h2>
        
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/10 transition">
                  <td className="p-5 font-bold text-gray-900">
                    {order.items[0]?.product.name || "Product"}
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-gray-800 text-sm">{order.user.name}</p>
                    <p className="text-[10px] text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="p-5 font-black text-emerald-600">₹{order.total}</td>

                  {/* 👇 FIX: Ab "SOLD" nahi, "PENDING" ya database wala status dikhega */}
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      order.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                      order.status === "DELIVERED" ? "bg-green-50 text-green-700 border-green-100" :
                      "bg-blue-50 text-blue-700 border-blue-100"
                    }`}>
                      {order.status}
                    </span>
                  </td>

                  {/* 👇 FIX: Yahan dropdown dalo taaki seller ise change kar sake */}
                  <td className="p-5 text-right">
                    <StatusDropdown orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}