import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// 👈 Naye imports jo missing thhe
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/lib/auth"; 

const prisma = new PrismaClient();

// GET: Saare Vendors ki list lao
export async function GET() {
  try {
    const vendors = await prisma.user.findMany({
      where: { role: "SELLER" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

// POST: Naya Vendor Create Karo
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: "Email already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "SELLER",
      },
    });

    return NextResponse.json(newVendor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating vendor" }, { status: 500 });
  }
}

// DELETE: Vendor ko remove karo
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting vendor" }, { status: 500 });
  }
}

// PATCH: Admin ke zariye status update
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  // 🛡️ Security: Sirf ADMIN hi update kar sake
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, isVerified, isBlocked } = body;

    const updatedVendor = await prisma.user.update({
      where: { id: id },
      data: { 
        ...(isVerified !== undefined && { isVerified }),
        ...(isBlocked !== undefined && { isBlocked }),
      },
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    return NextResponse.json({ message: "Database update failed ❌" }, { status: 500 });
  }
}