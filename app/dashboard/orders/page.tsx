import { PrismaClient } from "@prisma/client";
import OrderStatusDropdown from "@/components/OrderStatusDropdown";

const prisma = new PrismaClient();

export default async function OrderManagementPage() {
  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-black text-gray-900 mb-10">Order Logistics 📦</h1>
      
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase">Order Details</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase">Customer</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase">Total Amount</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase text-right">Change Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-blue-50/10 transition">
                <td className="p-6">
                  <p className="font-mono text-xs font-black text-blue-600">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-6">
                  <p className="font-black text-gray-900">{order.user.name}</p>
                  <p className="text-[10px] font-bold text-gray-400">{order.user.email}</p>
                </td>
                <td className="p-6">
                  <p className="text-lg font-black text-gray-900">₹{order.total.toLocaleString()}</p>
                </td>
                <td className="p-6 text-right">
                  <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}