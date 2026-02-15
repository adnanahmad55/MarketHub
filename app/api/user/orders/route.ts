import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 👈 Pro Tip: Ise ek separate file (lib/prisma.ts) mein rakhna best hai
const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 🛡️ Security Check
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔍 Orders Fetching logic
    const orders = await prisma.order.findMany({
      where: { 
        userId: (session.user as any).id 
      },
      include: {
        items: {
          include: { 
            product: {
              select: {
                name: true,
                images: true,
                price: true,
                category: true
              }
            } 
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(orders);

  } catch (error: any) {
    console.error("Fetch Orders Error:", error.message);
    return NextResponse.json(
      { message: "Orders load nahi ho paye ❌" }, 
      { status: 500 }
    );
  }
}