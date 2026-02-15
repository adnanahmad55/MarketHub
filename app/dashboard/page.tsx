import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import AdminChart from "@/components/AdminChart";
import TopVendors from "@/components/TopVendors";
import ReportButton from "@/components/ReportButton"; // 👈 Naya component import kiya

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // 🛡️ Security Guard
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  // 1. 📊 Saara Real Data Fetch Karo
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();
  
  const allOrders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // PDF Report ke liye detailed sales data fetch karo
  const allSalesData = await prisma.orderItem.findMany({
    include: {
      product: { include: { seller: true } },
      order: { include: { user: true } }
    }
  });

  const totalPlatformRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
  const settledRevenue = allOrders
    .filter(order => order.status === "DELIVERED") // 👈 Sirf Delivered filter kiya
    .reduce((sum, order) => sum + order.total, 0);
  // 2. Report Stats Prepare Karo
  const reportStats = {
    totalRevenue: settledRevenue,
    totalOrders: allOrders.length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Download Button */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Command Center 🛡️</h1>
          <ReportButton allSalesData={allSalesData} stats={reportStats} />
        </div>

        {/* 📈 Stats Grid (High Contrast) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500">
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Total Revenue</p>
            <p className="text-3xl font-black text-gray-900 mt-1">₹{settledRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Total Orders</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{allOrders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-purple-500">
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Total Products</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-500">
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Active Users</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{totalUsers}</p>
          </div>
        </div>

        {/* 📊 Charts & Leaderboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">Revenue Growth 🚀</h3>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Live Analytics</span>
              </div>
              <AdminChart />
            </div>
          </div>
          <div className="lg:col-span-1">
            <TopVendors />
          </div>
        </div>

        {/* 📑 Recent Transactions Table (Crystal Clear) */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-black text-gray-900">Recent Transactions</h2>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Recent Activity</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b">
                <tr>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/20 transition group">
                    <td className="p-5 font-mono text-xs font-black text-blue-600">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="p-5">
                      <p className="font-black text-gray-900 text-sm">{order.user.name}</p>
                      <p className="text-[10px] font-bold text-gray-400">{order.user.email}</p>
                    </td>
                    <td className="p-5 text-sm font-bold text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 font-black text-gray-900 text-lg">₹{order.total.toLocaleString()}</td>
                    <td className="p-5 text-right">
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100 shadow-sm">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}