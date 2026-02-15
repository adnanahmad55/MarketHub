import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import SalesChart from "../../../components/SalesChart";
const prisma = new PrismaClient();

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "SELLER") {
    redirect("/login");
  }

  const sellerId = (session.user as any).id;

  // 1. Fetch Seller's Products
  const myProducts = await prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch Orders (Jo items is seller ke bike hain)
  const sales = await prisma.orderItem.findMany({
    where: {
      product: { sellerId: sellerId }
    },
    include: {
      product: true,
      order: {
        include: { user: true }
      }
    },
    orderBy: { order: { createdAt: "desc" } }
  });

  // 3. Calculate Total Revenue
  const totalRevenue = sales.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Seller Hub 🏪</h1>
            <p className="text-gray-500 font-medium">Welcome back, <span className="text-blue-600 font-bold">{session.user?.name}</span></p>
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
            <p className="text-5xl font-black text-gray-900 mt-2">{myProducts.length}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-emerald-500">
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Earnings</h3>
            <p className="text-5xl font-black text-emerald-600 mt-2">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
         <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-12">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h3 className="text-xl font-black text-gray-900">Weekly Performance 📈</h3>
      <p className="text-sm text-gray-500 font-medium">Your sales trend for the last 7 days</p>
    </div>
    <div className="flex gap-2">
      <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Weekly</span>
    </div>
  </div>
  
  <SalesChart />
</div>
        {/* Recent Sales Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden mb-12 border border-gray-100">
          <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">📦 Recent Sales</h3>
            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase">Live Updates</span>
          </div>
          
          {sales.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic font-medium">
              No sales recorded yet. Start promoting your products! 🚀
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b">
                <tr>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Buyer Details</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Revenue</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-blue-50/20 transition group">
                    <td className="p-5 font-black text-gray-900 text-base">{sale.product.name}</td>
                    <td className="p-5">
                       <p className="text-sm font-bold text-gray-800">{sale.order.user.name}</p>
                       <p className="text-[10px] text-gray-400 font-medium">{sale.order.user.email}</p>
                    </td>
                    <td className="p-5 text-center font-black text-gray-700">{sale.quantity}</td>
                    <td className="p-5 text-center font-black text-emerald-600 text-lg">₹{sale.price * sale.quantity}</td>
                    <td className="p-5 text-right">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                        SOLD
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Your Inventory List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">Your Inventory</h3>
            <p className="text-xs font-bold text-gray-400 tracking-tighter uppercase">Manage Stock Levels</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b">
                <tr>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Point</th>
                  <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="p-5">
                       <img src={product.images[0]} className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm" alt={product.name}/>
                    </td>
                    <td className="p-5">
                        <p className="font-black text-gray-900 text-base">{product.name}</p>
                        <p className="text-[10px] font-black text-blue-500 uppercase">{product.category || "General"}</p>
                    </td>
                    <td className="p-5 text-emerald-600 font-black text-lg">₹{product.price.toLocaleString()}</td>
                    <td className="p-5 text-right">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black border ${
                        product.stock > 0 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
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