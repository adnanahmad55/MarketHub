export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import SalesChart from "../../components/SalesChart";
import StatusDropdown from "../../components/StatusDropdown";

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "SELLER") {
    redirect("/login");
  }

  const sellerId = (session.user as any).id;

  const myProducts = await prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });

  const sales = await prisma.orderItem.findMany({
    where: { product: { sellerId: sellerId } },
    include: {
      product: true,
      order: { include: { user: true } }
    },
    orderBy: { order: { createdAt: "desc" } }
  });

  // ✅ FIXED: Sirf "DELIVERED" status wale items ki earnings count hogi
  const totalRevenue = sales
    .filter((sale) => sale.order.status === "DELIVERED") // 👈 Ye filter zaroori hai
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
 
  // PDF Report ke liye stats prepare karo
  const sellerReportStats = {
    totalRevenue: totalRevenue,
    totalOrders: sales.length,
    sellerName: session.user?.name // Extra info for PDF
  };  

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">Seller Hub 🏪</h1>
            <p className="text-gray-500 font-medium italic">Dashboard for <span className="text-blue-600 font-bold">{session.user?.name}</span></p>
          </div>
          <Link href="/seller/new-product">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all font-black">
              + Add New Product
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-blue-500">
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Active Inventory</h3>
            <p className="text-5xl font-black mt-2">{myProducts.length}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-emerald-500">
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Settled Earnings (Delivered)</h3>
            <p className="text-5xl font-black text-emerald-600 mt-2">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden mb-12 border border-gray-100">
          <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center text-gray-900">
            <h3 className="text-xl font-black">📦 Recent Sales Activity</h3>
            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase">All Statuses</span>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b">
              <tr>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase">Product</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase">Buyer</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase text-center">Qty</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase text-center">Revenue</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase">Status</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-blue-50/20 transition group">
                  <td className="p-5 font-black text-gray-900 text-sm">{sale.product.name}</td>
                  <td className="p-5">
                    <p className="text-sm font-bold text-gray-800">{sale.order.user.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{sale.order.user.email}</p>
                  </td>
                  <td className="p-5 text-center font-black text-gray-700">{sale.quantity}</td>
                  <td className="p-5 text-center font-black text-emerald-600">₹{sale.price * sale.quantity}</td>
                  
                  {/* Status Badge */}
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      sale.order.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                      sale.order.status === "PROCESSING" ? "bg-blue-50 text-blue-700 border-blue-100" :
                      sale.order.status === "DELIVERED" ? "bg-green-50 text-green-700 border-green-100" :
                      "bg-gray-50 text-gray-700 border-gray-100"
                    }`}>
                      {sale.order.status}
                    </span>
                  </td>

                  <td className="p-5 text-right">
                    <StatusDropdown orderId={sale.order.id} currentStatus={sale.order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inventory Section remains same */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b"><h3 className="text-xl font-black">Your Inventory</h3></div>
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-50">
              {myProducts.map((product) => (
                <tr key={product.id}>
                  <td className="p-5"><img src={product.images[0]} className="w-12 h-12 rounded-xl object-cover" alt={product.name}/></td>
                  <td className="p-5 font-black">{product.name}</td>
                  <td className="p-5 text-emerald-600 font-black">₹{product.price.toLocaleString()}</td>
                  <td className="p-5 text-right font-bold text-xs">{product.stock} left</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}