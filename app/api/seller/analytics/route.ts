import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const sellerId = (session.user as any).id;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 1. Fetch Orders for this seller from last 7 days
  const salesData = await prisma.orderItem.findMany({
    where: {
      product: { sellerId },
      order: { createdAt: { gte: sevenDaysAgo } }
    },
    include: { order: true }
  });

  // 2. Data ko Days mein map karo (Mon, Tue, etc.)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = days.map(day => ({ day, sales: 0 }));

  salesData.forEach(item => {
    const dayName = days[new Date(item.order.createdAt).getDay()];
    const index = chartData.findIndex(d => d.day === dayName);
    if (index !== -1) {
      chartData[index].sales += (item.price * item.quantity);
    }
  });

  return NextResponse.json(chartData);
}