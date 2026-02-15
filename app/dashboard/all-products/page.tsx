import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import DeleteProductButton from "../../../components/DeleteProductButton"; 
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export default async function AllProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Inventory Management 📦</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all platform products in one place.</p>
        </div>
        <span className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-sm font-black shadow-lg shadow-blue-100">
          Total: {products.length} Items
        </span>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product Info</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Stock Status</th>
              <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-blue-50/20 transition group">
                {/* Product Info */}
                <td className="p-5 flex items-center gap-4">
                  <div className="h-14 w-14 relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                    <Image 
                      src={product.images[0] || "/placeholder.png"} 
                      fill 
                      className="object-cover group-hover:scale-110 transition duration-500" 
                      alt={product.name} 
                    />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-base">{product.name}</p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase">ID: {product.id.slice(-8)}</p>
                  </div>
                </td>

                {/* 👇 Category Fix: Ab ekdum sharp dikhega */}
                <td className="p-5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                    product.category?.toLowerCase() === 'electronics' 
                      ? 'bg-purple-50 text-purple-700 border-purple-100 shadow-sm' 
                      : 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm'
                  }`}>
                    {product.category || "General"}
                  </span>
                </td>

                {/* Price */}
                <td className="p-5">
                  <p className="font-black text-gray-900 text-lg">₹{product.price.toLocaleString()}</p>
                </td>

                {/* Stock */}
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-bold ${product.stock > 0 ? 'text-gray-700' : 'text-red-500'}`}>
                      {product.stock} units left
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="p-5 text-right">
                  <DeleteProductButton productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}