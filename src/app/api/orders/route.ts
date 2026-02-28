import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      customerName: true,
      tireSpec: true,
      quantity: true,
    },
  });
  return NextResponse.json({ orders });
}
