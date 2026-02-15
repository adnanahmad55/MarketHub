import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Ab ye har page par dikhega */}
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="hover:text-blue-400 cursor-pointer block">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/vendors" className="hover:text-blue-400 cursor-pointer block">
              Manage Vendors
            </Link>
          </li>
          {/* 📦 NAYA LINK: Isse yahan add karo */}
  <Link 
    href="/dashboard/orders" 
    className="flex items-center gap-3 p-3 text-white font-black bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20 transition"
  >
    Orders Management
  </Link>
       <Link href="/dashboard/all-products" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium">
            📦 All Products
          </Link>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}