import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const productId = Number(searchParams.get("productId"))

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 })
  }

  const customizations = await prisma.productCustomization.findMany({
    where: { productId },
    include: {
      customizationOption: true,
    },
  })

  const options = customizations.map(c => c.customizationOption)
  return NextResponse.json(options)
}
