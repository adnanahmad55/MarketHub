import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 1. Saare OrderItems fetch karo seller details ke saath
  const sales = await prisma.orderItem.findMany({
    include: {
      product: {
        include: { seller: true }
      }
    }
  });

  // 2. Revenue calculation by Vendor
  const vendorMap: any = {};

  sales.forEach(item => {
    const seller = item.product.seller;
    if (!vendorMap[seller.id]) {
      vendorMap[seller.id] = {
        name: seller.name,
        email: seller.email,
        revenue: 0,
        salesCount: 0
      };
    }
    vendorMap[seller.id].revenue += (item.price * item.quantity);
    vendorMap[seller.id].salesCount += item.quantity;
  });

  // 3. Array mein convert karke sort karo (Highest Revenue First)
  const topVendors = Object.values(vendorMap)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5); // Sirf top 5 dikhao

  return NextResponse.json(topVendors);
}