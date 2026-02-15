import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
const prisma = new PrismaClient();

// 👇 Update 1: Type ko 'Promise' banaya
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 👇 Update 2: Pehle params ko 'await' kiya
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id }, // Ab direct 'id' use kar rahe hain
    include: { seller: true },
  });

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Back Button */}
        <Link href="/" className="text-gray-500 hover:text-black mb-6 inline-block font-medium">
          ← Back to Shop
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Image */}
          <div className="bg-gray-100 p-10 flex items-center justify-center">
            <img 
              src={product.images[0] || "https://via.placeholder.com/500"} 
              alt={product.name} 
              className="max-h-96 object-contain hover:scale-105 transition duration-500 drop-shadow-lg"
            />
          </div>

          {/* Right: Details */}
          <div className="p-10 flex flex-col justify-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wide">
              {product.category}
            </span>
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{product.description}</p>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${product.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Seller Info */}
          <div className="border-t border-gray-100 pt-6 mb-8">
  <p className="text-sm text-gray-500 mb-1">Sold by</p>
  <div className="flex items-center gap-2">
    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
      {/* 👈 Fix 1: Optional chaining use kiya hai */}
      {product.seller?.name?.charAt(0) || "S"} 
    </div>
    <p className="font-semibold text-gray-900">
      {/* 👈 Fix 2: Fallback name diya hai */}
      {product.seller?.name || "Unknown Seller"}
    </p>
  </div>
</div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              
                {/* 👇 Naya Component */}
                <AddToCartButton product={product} /> 
                
            <BuyNowButton product={product} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}