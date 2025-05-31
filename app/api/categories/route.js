import { PrismaClient } from "@prisma/client"
import slugify from "slugify"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return NextResponse.json(categories)
}

export async function POST(req) {
  try {
    const { name } = await req.json()

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Le nom est requis." }, { status: 400 })
    }

    const slug = slugify(name, { lower: true, strict: true })

    const exists = await prisma.category.findUnique({ where: { slug } })
    if (exists) {
      return NextResponse.json({ error: "Une catégorie avec ce nom existe déjà." }, { status: 409 })
    }

    const newCategory = await prisma.category.create({
      data: { name, slug },
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Erreur POST /categories :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
