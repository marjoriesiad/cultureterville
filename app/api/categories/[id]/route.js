import { PrismaClient } from "@prisma/client"
import slugify from "slugify"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function PATCH(req, context) {
  const id = Number(context.params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 })
  }

  try {
    const { name } = await req.json()
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Le nom est requis." }, { status: 400 })
    }

    const slug = slugify(name, { lower: true, strict: true })

    const existing = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Une autre catégorie utilise déjà ce nom." },
        { status: 409 }
      )
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name, slug },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Erreur PATCH /categories/[id] :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req, context) {
  const id = Number(context.params.id)
  const { searchParams } = new URL(req.url)
  const force = searchParams.get("force") === "true"

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 })
  }

  try {
    if (force) {
      const products = await prisma.product.findMany({
        where: { categoryId: id },
        select: { id: true },
      })

      const productIds = products.map(p => p.id)

      if (productIds.length > 0) {
        await prisma.productCustomization.deleteMany({
          where: { productId: { in: productIds } },
        })

        await prisma.product.deleteMany({
          where: { id: { in: productIds } },
        })
      }
    } else {
      const productCount = await prisma.product.count({
        where: { categoryId: id },
      })

      if (productCount > 0) {
        return NextResponse.json(
          { error: "Cette catégorie contient encore des produits." },
          { status: 400 }
        )
      }
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur DELETE /categories/[id] :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
