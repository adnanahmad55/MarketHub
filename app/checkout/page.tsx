"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, cartCount } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: cart, totalAmount }),
    });

    if (res.ok) {
      alert("Order Placed Successfully! 🎉");
      localStorage.removeItem("cart"); // Cart khali karo
      window.location.href = "/"; // Homepage par bhejo
    } else {
      alert("Failed to place order ❌");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout 💳</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleCheckout} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Full Name</label>
    <input 
      type="text" 
      required 
      className="w-full border p-2 rounded mt-1 text-black bg-white" // 👈 text-black add kiya
      placeholder="Adnan Ahmad" 
    />
  </div>
  
  <div>
    <label className="block text-sm font-medium text-gray-700">Address</label>
    <textarea 
      required 
      className="w-full border p-2 rounded mt-1 text-black bg-white" // 👈 text-black add kiya
      rows={3} 
      placeholder="123 Street, City..." 
    />
  </div>
  
  {/* ... baaki fields mein bhi same change kar dena */}

  <button 
    type="submit" 
    disabled={loading}
    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
  >
    {loading ? "Processing..." : "Confirm Order ✅"}
  </button>
</form>

          {/* Cart Preview */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="font-bold text-gray-700 mb-4">Your Items</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-4 border-b pb-2">
                <img src={item.image} className="w-12 h-12 rounded object-cover" />
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="ml-auto font-bold text-sm">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}