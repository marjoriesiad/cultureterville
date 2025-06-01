import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashed,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Erreur REGISTER:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
