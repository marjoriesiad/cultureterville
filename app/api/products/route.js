import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import slugify from "slugify"
import path from "path"
import { v4 as uuid } from "uuid"
import { writeFile } from "fs/promises"

const prisma = new PrismaClient()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get("categoryId")

  let where = {}
  if (categoryId) {
    where.categoryId = Number(categoryId)
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
  })

  return NextResponse.json(products)
}


export async function POST(req) {
  const formData = await req.formData()

  const name = formData.get("name")
  const price = parseFloat(formData.get("price"))
  const description = formData.get("description")
  const stock = parseInt(formData.get("stock"))
  const categoryId = parseInt(formData.get("categoryId"))
  const isCustomizable = formData.get("isCustomizable") === "true"
  const imageFile = formData.get("image")

  if (!name || !price || !stock || !categoryId) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 })
  }

  const slug = slugify(name, { lower: true, strict: true })

  let imagePath = "/images/default.jpg"
  if (imageFile && typeof imageFile.name === "string") {
    const ext = path.extname(imageFile.name)
    const fileName = `${uuid()}${ext}`
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(process.cwd(), "public", "uploads", fileName)
    await writeFile(filePath, buffer)
    imagePath = `/uploads/${fileName}`
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price,
        description,
        stock,
        image: imagePath,
        isCustomizable,
        categoryId,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error("Erreur POST /products :", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
