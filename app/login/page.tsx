"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

 // app/login/page.tsx ke handleSubmit function ko replace karo:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1. Login ki request bhejo
  const result = await signIn("credentials", {
    ...data,
    redirect: false,
  });

  if (result?.error) {
    setError("Invalid email or password");
  } else {
    // 2. Login Success! Ab check karte hain banda kaun hai
    router.refresh(); // Next.js ko naya session load karne bolo

    // 3. Current Session fetch karke Role pata karo
    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();

    // 4. Role ke hisaab se redirect karo
    if (sessionData?.user?.role === "ADMIN") {
      window.location.href = "/dashboard"; // Admin ka ilaka
    } else if (sessionData?.user?.role === "SELLER") {
      window.location.href = "/seller";    // Seller ki dukan
    } else {
      window.location.href = "/";          // Normal customer ka homepage
    }
  }
};
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Login to Store</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full p-2 border rounded mt-1 text-black"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="******"
              className="w-full p-2 border rounded mt-1 text-black"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}