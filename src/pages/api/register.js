// routes/users.js
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/utils/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      const hashedPassword = await hashPassword(password, 10);

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
