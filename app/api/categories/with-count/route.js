import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    })

    const result = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      productCount: cat._count.products,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur API /categories/with-count :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
