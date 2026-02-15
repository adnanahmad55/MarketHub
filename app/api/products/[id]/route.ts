import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 1. Type ko Promise banao
) {
  const session = await getServerSession(authOptions);

  // Sirf ADMIN hi delete kar sake
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; // 👈 2. params ko await karo

    await prisma.product.delete({
      where: { id: id }, // 👈 3. params.id ki jagah sirf id use karo
    });
    
    return NextResponse.json({ message: "Product Deleted ✅" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}