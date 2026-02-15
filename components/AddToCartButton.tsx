"use client";

import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast"; // 👈 Pro Tip: User ko feedback dene ke liye

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    // User ko batane ke liye ki item add ho gaya hai
    alert(`${product.name} added to cart! 🛒`); 
  };

  return (
    <button 
      onClick={handleAdd} // 👈 Ye missing tha!
      disabled={product.stock <= 0}
      className={`p-3 rounded-xl font-bold transition flex-1 ${
        product.stock <= 0 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
          : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
      }`}
    >
      {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}