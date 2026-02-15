export const dynamic = "force-dynamic"; // 👈 Refresh fix ke liye zaroori hai

import {  } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatusDropdown from "@/components/StatusDropdown"; // Naya component

export default async function SellerOrders() {
  const session = await getServerSession(authOptions);
  const sellerId = (session.user as any).id;

  // 🔍 Sirf is seller ke products waale orders fetch karo
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: { product: { sellerId: sellerId } }
      }
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-8">My Shop Orders 📦</h1>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-5">Order ID</th>
              <th className="p-5">Customer</th>
              <th className="p-5">Total</th>
              <th className="p-5 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-5 font-bold">#{order.id.slice(-8).toUpperCase()}</td>
                <td className="p-5">{order.user.name}</td>
                <td className="p-5 font-black">₹{order.total}</td>
                <td className="p-5 text-right">
                  {/* 👈 Naya Status Control Component */}
                  <StatusDropdown orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}