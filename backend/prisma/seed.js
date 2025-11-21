// prisma/seed.js
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);

  const adminPass = await bcrypt.hash("Admin@123", salt);
  const userPass = await bcrypt.hash("User@1234", salt);

  await prisma.user.create({
    data: {
      name: "System Administrator Default User",
      email: "admin@example.com",
      password: adminPass,
      address: "Admin Address Seed",
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Regular Normal User Seed Account",
      email: "user@example.com",
      password: userPass,
      address: "User Address Seed",
      role: "USER",
    },
  });

  await prisma.store.create({
    data: {
      name: "Green Grocery Store",
      email: "green@grocery.local",
      address: "123 Market Road",
    },
  });

  await prisma.store.create({
    data: {
      name: "Techie Electronics",
      email: "hello@techie.local",
      address: "77 Tech Park",
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
