import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  
  // Security: Sirf ADMIN hi ye data dekh sake
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 1. Saare sellers ki sales fetch karo
  const allSales = await prisma.orderItem.findMany({
    where: {
      order: { createdAt: { gte: sevenDaysAgo } }
    },
    include: { order: true }
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const globalData = days.map(day => ({ day, revenue: 0 }));

  allSales.forEach(item => {
    const dayName = days[new Date(item.order.createdAt).getDay()];
    const index = globalData.findIndex(d => d.day === dayName);
    if (index !== -1) {
      globalData[index].revenue += (item.price * item.quantity);
    }
  });

  return NextResponse.json(globalData);
}