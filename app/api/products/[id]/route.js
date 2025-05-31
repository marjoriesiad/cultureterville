import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import path from "path"
import { writeFile } from "fs/promises"
import { v4 as uuid } from "uuid"
import slugify from "slugify"

const prisma = new PrismaClient()

export async function PATCH(req, { params }) {
  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

  try {
    const formData = await req.formData()

    const name = formData.get("name")
    const price = parseFloat(formData.get("price"))
    const description = formData.get("description")
    const stock = parseInt(formData.get("stock"))
    const categoryId = parseInt(formData.get("categoryId"))
    const isCustomizable = formData.get("isCustomizable") === "true"
    const imageFile = formData.get("image")

    const slug = slugify(name, { lower: true, strict: true })

    const existing = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    })
    if (existing) {
      return NextResponse.json({ error: "Un autre produit porte déjà ce nom." }, { status: 409 })
    }

    let imagePath = undefined
    if (imageFile && typeof imageFile.name === "string") {
      const ext = path.extname(imageFile.name)
      const fileName = `${uuid()}${ext}`
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const filePath = path.join(process.cwd(), "public/uploads", fileName)
      await writeFile(filePath, buffer)
      imagePath = `/uploads/${fileName}`
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        price,
        description,
        stock,
        categoryId,
        isCustomizable,
        ...(imagePath && { image: imagePath }),
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error("Erreur PATCH produit:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 })

  try {
    await prisma.productCustomization.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Erreur DELETE produit:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
