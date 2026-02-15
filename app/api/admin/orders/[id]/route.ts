import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  // 🛡️ Admin Security Check
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Next.js 15+ params fix
  const { id } = await params; 
  const { status } = await req.json();

  try {
    // Sirf status update karo bina kisi extra join ke
    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status: status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Order Update Error:", error.message);
    return NextResponse.json({ message: "Order update failed" }, { status: 500 });
  }
}