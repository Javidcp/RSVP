import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

async function main() {
    const passwordHash = await bcrypt.hash("password123", 12);

    await prisma.user.upsert({
        where: {
        email: "javid@gmail.com"
        },
        update: {},
        create: {
        name: "Javid",
        email: "javid@gmail.com",
        passwordHash
        }
    });

    await prisma.user.upsert({
        where: {
        email: "rahul@gmail.com"
        },
        update: {},
        create: {
        name: "Rahul",
        email: "rahul@gmail.com",
        passwordHash
        }
    });

    await prisma.user.upsert({
        where: {
        email: "arun@gmail.com"
        },
        update: {},
        create: {
        name: "Arun",
        email: "arun@gmail.com",
        passwordHash
        }
    });

    console.log("Users seeded successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });