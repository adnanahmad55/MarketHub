"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation"; // 👈 Redirection ke liye
import toast from "react-hot-toast";

export default function BuyNowButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    // 1. Pehle cart mein item dalo
    addToCart(product);
    
    // 2. User ko feedback do
    toast.success("Proceeding to checkout... 🚀");

    // 3. ⚡ Seedha Checkout ya Cart page par bhej do
    router.push("/cart"); 
  };

  return (
    <button 
      onClick={handleBuyNow} // 👈 Ye lagana mat bhulna!
      disabled={product.stock <= 0}
      className={`p-3 rounded-xl font-bold transition flex-[2] ${
        product.stock <= 0 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
          : "bg-gray-900 text-white hover:bg-black active:scale-95 shadow-lg"
      }`}
    >
      {product.stock <= 0 ? "Out of Stock" : "Buy Now"}
    </button>
  );
}