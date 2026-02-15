export const dynamic = "force-dynamic"; // ✅ Refresh par database se fresh status uthayega

import { prisma } from "@/lib/prisma"; // ✅ Shared singleton prisma instance
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatusDropdown from "@/components/StatusDropdown"; 

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);
  
  // 🛡️ Fix for Line 10 Error: TypeScript ko pakka batana padega ki session null nahi hai
  if (!session || !session.user) {
    return (
      <div className="p-8 text-center font-black text-red-500 bg-red-50 rounded-3xl">
        Please login to access the Seller Dashboard. ❌
      </div>
    );
  }

  // ✅ Ab TypeScript error nahi dega kyunki upar check ho gaya hai
  const sellerId = (session.user as any).id;

  // 🔍 Fetching only orders that contain this seller's products
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
    take: 5 // Dashboard par latest 5 sales dikhane ke liye
  });

  return (
    <div className="p-8">
      {/* ... Aapke Sales Stats Cards yahan rahenge (image_e58e80.jpg) ... */}

      <div className="mt-10">
        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          📦 Recent Sales <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">LIVE</span>
        </h2>
        
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Buyer</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/10 transition group">
                  {/* 1. Product Name */}
                  <td className="p-5 font-bold text-gray-900">
                    {order.items[0]?.product.name || "Multiple Items"}
                  </td>

                  {/* 2. Buyer Details */}
                  <td className="p-5">
                    <p className="font-bold text-gray-800 text-sm">{order.user.name}</p>
                    <p className="text-[10px] text-gray-400">{order.user.email}</p>
                  </td>

                  {/* 3. Revenue */}
                  <td className="p-5 font-black text-emerald-600">
                    ₹{order.total.toLocaleString()}
                  </td>

                  {/* 4. 👇 DYNAMIC STATUS BADGE (Hardcoded "SOLD" hata diya) */}
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      order.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                      order.status === "DELIVERED" ? "bg-green-50 text-green-700 border-green-100" :
                      "bg-blue-50 text-blue-700 border-blue-100"
                    }`}>
                      {order.status}
                    </span>
                  </td>

                  {/* 5. 👇 ACTION DROPDOWN (Isse seller status badal payega) */}
                  <td className="p-5 text-right">
                    <StatusDropdown orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-bold italic">
              No recent sales yet. Get started by adding products! 🛒
            </div>
          )}
        </div>
      </div>
    </div>
  );
}