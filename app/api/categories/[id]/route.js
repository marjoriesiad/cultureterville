import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function DELETE(req, context) {
  const id = Number(context.params.id)
  const { searchParams } = new URL(req.url)
  const force = searchParams.get("force") === "true"

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 })
  }

  try {
    if (force) {
      // 1. Récupérer tous les IDs des produits de cette catégorie
      const products = await prisma.product.findMany({
        where: { categoryId: id },
        select: { id: true },
      })

      const productIds = products.map(p => p.id)

      if (productIds.length > 0) {
        // 2. Supprimer les personnalisations liées à ces produits
        await prisma.productCustomization.deleteMany({
          where: { productId: { in: productIds } },
        })

        // 3. Supprimer les produits eux-mêmes
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

    // 4. Supprimer la catégorie
    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur suppression catégorie :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
