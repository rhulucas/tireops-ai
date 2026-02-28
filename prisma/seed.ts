import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@tireops.com" },
    create: {
      email: "admin@tireops.com",
      passwordHash: hash,
      name: "Admin",
      role: "ADMIN",
    },
    update: {},
  });

  console.log("Admin user:", admin.email);

  await prisma.order.createMany({
    data: [
      { orderNumber: "ORD-001", status: "PRODUCTION", customerName: "ABC Fleet", tireSpec: "225/65R17", quantity: 500 },
      { orderNumber: "ORD-002", status: "QC_CHECK", customerName: "XYZ Motors", tireSpec: "205/55R16", quantity: 200 },
      { orderNumber: "ORD-003", status: "PENDING", customerName: "Truck Co", tireSpec: "275/70R18", quantity: 100 },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
