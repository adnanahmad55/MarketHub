import { AuthProvider } from "../components/AuthProvider"; 
import Navbar from "../components/Navbar"; // 👈 Import kiya
import "./globals.css";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Multi-Vendor Store",
  description: "Ecommerce Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar /> {/* 👈 Yahan Add kar diya (Sabse upar) */}
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}