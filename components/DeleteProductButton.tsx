"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Delete failed ❌");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 font-bold text-sm transition"
    >
      Delete
    </button>
  );
}