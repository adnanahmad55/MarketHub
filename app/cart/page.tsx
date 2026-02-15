"use client";

import { useCart } from "@/context/CartContext"; // Path check karlena (../context/CartContext)
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  // Total Price Calculate karo
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty 🛒</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/">
          <button className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition">
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({cart.length} items)</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Cart Items */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center p-6 border-b hover:bg-gray-50 transition">
                <img 
                  src={item.image || "https://via.placeholder.com/100"} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-gray-500 text-sm">₹{item.price} x {item.quantity}</p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 mb-2">₹{item.price * item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between mb-8 text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              <Link href="/checkout">
                   <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
                     Proceed to Checkout 💳
                   </button>
                 </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}