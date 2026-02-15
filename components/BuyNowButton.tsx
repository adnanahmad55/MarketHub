"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function BuyNowButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    addToCart(product); // 1. Cart mein add karo
    router.push("/checkout"); // 2. Seedha checkout par bhej do
  };

  return (
<button 
  disabled={product.stock <= 0} 
  className={`w-full py-4 rounded-2xl font-black transition ${
    product.stock <= 0 
      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
      : "bg-black text-white hover:bg-gray-800 shadow-xl"
  }`}
>
  {product.stock <= 0 ? "Out of Stock 🚫" : "Buy Now"}
</button>
  );
}