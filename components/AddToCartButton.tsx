"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
 <button 
  disabled={product.stock <= 0} // 👈 Stock 0 hai toh button band
  className={`p-3 rounded-xl font-bold transition ${
    product.stock <= 0 
      ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Disabled look
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`}
>
  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
</button>
  );
}