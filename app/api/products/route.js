import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get("category")

  if (!categorySlug) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 })
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (!category) {
    return NextResponse.json([], { status: 200 })
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(products)
}
