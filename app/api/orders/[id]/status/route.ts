import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }, // 👈 Ye Neon database mein value lock kar dega
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ message: "Status update failed" }, { status: 500 });
  }
}