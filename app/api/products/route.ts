import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth"; 

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Check karo user login hai aur SELLER hai
    const session = await getServerSession(authOptions);
   // (session.user as any) likhne se error hat jayega
   if (!session || (session.user as any).role !== "SELLER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Data nikalo frontend se
    const body = await req.json();
    const { name, description, price, category, image, stock } = body;

    // 3. Database mein save karo
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price), // String ko number banao
        category,
        images: [image], // URL ko array mein daal rahe hain
        stock: parseInt(stock),
       sellerId: (session.user as any).id, // Login seller ki ID
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product Error:", error);
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }
}