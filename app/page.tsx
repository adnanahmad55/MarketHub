import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation"; // 👈 New: Added for protection

const prisma = new PrismaClient();

export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  // 1. Session check (Login Status Guard)
  const session = await getServerSession(authOptions);

  // 🛡️ Agar user logged in nahi hai, toh use login page par bhej do
  if (!session) {
    redirect("/login");
  }

  // 2. URL se search query nikalo
  const params = await searchParams;
  const query = params.search || "";

  // 3. Products fetch karo (Purana Search Logic barkaraar hai)
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ]
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-gray-50 to-white py-16 text-center border-b">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {query ? `Results for "${query}"` : "Welcome to Our Market"}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {query 
            ? `Showing products matching your search query.` 
            : "Discover the best products from verified sellers at unbeatable prices."}
        </p>
      </header>

      {/* Product Grid Section */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <div>
            <h3 className="text-3xl font-bold text-gray-800">
              {query ? "Search Results" : "Latest Arrivals"}
            </h3>
            <p className="text-gray-500 mt-1">
              {query ? `We found ${products.length} matching items` : "Fresh stock just added"}
            </p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
            {products.length} Items
          </span>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl font-medium">
              No products found for "{query}"
            </p>
            <Link href="/" className="text-blue-600 underline mt-4 inline-block font-medium">
              View all products
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300">
                <div className="h-56 overflow-hidden bg-gray-100 relative">
                  <img 
                    src={product.images[0] || "https://via.placeholder.com/300"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold rounded shadow-sm text-gray-800">
                    New
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">{product.category || "General"}</p>
                  <h4 className="font-bold text-lg text-gray-900 truncate mb-2">{product.name}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                    <span className="text-xl font-extrabold text-gray-900">₹{product.price}</span>
                    <Link href={`/product/${product.id}`}>
                      <button className="bg-black text-white text-xs px-4 py-2 rounded-lg hover:bg-gray-800 transition font-medium">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}