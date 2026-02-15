import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // 👈 1. Isse Promise define karo
) {
  const session = await getServerSession(authOptions);
  
  // 🛡️ Admin Security Check
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 👈 2. Params ko await karna compulsory hai
  const { id } = await params; 
  const { isVerified, isBlocked } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id }, // 👈 3. Ab 'id' ekdum sahi jayegi
      data: { 
        isVerified: isVerified !== undefined ? isVerified : undefined,
        isBlocked: isBlocked !== undefined ? isBlocked : undefined 
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    // 🔍 Terminal mein error dekhne ke liye log add kiya hai
    console.error("PRISMA UPDATE ERROR:", error.message);
    return NextResponse.json({ message: "Update failed", details: error.message }, { status: 500 });
  }
}