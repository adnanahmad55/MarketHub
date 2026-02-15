import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Please Login first" }, { status: 401 });
    }

    const { cartItems, totalAmount } = await req.json();

    // 1. 🛡️ STOCK VALIDATION (Pehle check karo, phir becho)
    for (const item of cartItems) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.id },
        select: { stock: true, name: true }
      });

      if (!dbProduct || dbProduct.stock < item.quantity) {
        return NextResponse.json({ 
          message: `Maaf kijiye, ${dbProduct?.name || "Product"} out of stock hai! 🚫` 
        }, { status: 400 });
      }
    }

    // 2. ⚡ TRANSACTION (Saara kaam ek saath hoga, ya kuch nahi hoga)
    const result = await prisma.$transaction(async (tx) => {
      // Order Create Karo
 const order = await tx.order.create({
  data: {
    userId: (session.user as any).id,
    total: totalAmount,
    status: "PENDING", // 👈 "COMPLETED" hata kar "PENDING" karo
    items: {
      create: cartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  },
});

      // Stock Deduct Karo
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return order;
    });

    return NextResponse.json({ message: "Order Placed Successfully ✅", orderId: result.id });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: "Server error, please try again" }, { status: 500 });
  }
}