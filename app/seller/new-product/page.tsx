"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload"; // 👈 Ye already imported hai

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "", 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 💡 Validation: Check karo image upload hui hai ya nahi
    if (!form.image) {
      return alert("Please upload a product image first! 📸");
    }

    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Product Added Successfully! 🎉");
      router.push("/seller");
      router.refresh();
    } else {
      alert("Something went wrong ❌");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Product 📦</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input 
              type="text" required 
              className="w-full border p-2 rounded mt-1 text-black"
              placeholder="e.g. iPhone 15 Pro"
              value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              required rows={3}
              className="w-full border p-2 rounded mt-1 text-black"
              placeholder="Product details..."
              value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} 
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input 
                type="number" required 
                className="w-full border p-2 rounded mt-1 text-black"
                placeholder="999"
                value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Qty</label>
              <input 
                type="number" required 
                className="w-full border p-2 rounded mt-1 text-black"
                placeholder="10"
                value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} 
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input 
              type="text" required 
              className="w-full border p-2 rounded mt-1 text-black"
              placeholder="Electronics, Fashion, etc."
              value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} 
            />
          </div>

          {/* --- 📸 IMAGE UPLOAD SECTION (PEHLE YAHAN INPUT THA) --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <ImageUpload 
              value={form.image} 
              onChange={(url) => setForm({ ...form, image: url })} 
            />
            {form.image && <p className="text-xs text-green-600 mt-2 font-medium">✅ Image uploaded successfully!</p>}
          </div>
          {/* ------------------------------------------------------ */}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition mt-6"
          >
            {loading ? "Saving..." : "Publish Product"}
          </button>
        </form>
      </div>
    </div>
  );
}