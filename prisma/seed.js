import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
}

async function main() {
  console.log('🧨 Vidage de la base...')
  await prisma.productCustomization.deleteMany()
  await prisma.customizationOption.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('🍞 Création des catégories...')
  const viennoiseries = await prisma.category.create({
    data: { name: 'Viennoiseries', slug: 'viennoiseries' }
  })

  const sandwichs = await prisma.category.create({
    data: { name: 'Sandwichs', slug: 'sandwichs' }
  })

  const patisseries = await prisma.category.create({
    data: { name: 'Pâtisseries', slug: 'patisseries' }
  })

  console.log('🥐 Création des produits...')
  const viennoiserieNames = [
    "Croissant", "Pain au chocolat", "Chausson aux pommes", "Brioche", "Pain aux raisins",
    "Croissant amandes", "Beignet", "Torsade chocolat", "Pain suisse", "Palmier"
  ]

  const sandwichNames = [
    "Jambon-fromage", "Poulet crudités", "Thon mayo", "Végétarien", "Rosbif salade",
    "Saucisson beurre", "Panini fromage", "Club sandwich", "Wrap saumon", "Focaccia poulet"
  ]

  const patisserieNames = [
    "Éclair chocolat", "Tarte citron", "Mille-feuille", "Flan", "Paris-Brest",
    "Opéra", "Tartelette fraise", "Moelleux chocolat", "Tiramisu", "Religieuse"
  ]

  const sandwichProducts = []

  for (const name of viennoiserieNames) {
    await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
        image: `/images/${slugify(name)}.jpg`,
        price: 1.2 + Math.random(),
        stock: 50,
        isCustomizable: false,
        categoryId: viennoiseries.id,
      },
    })
  }

  for (const name of sandwichNames) {
    const product = await prisma.product.create({
      data: {
        name: `Sandwich ${name}`,
        slug: slugify(`sandwich ${name}`),
        image: `/images/sandwich-${slugify(name)}.jpg`,
        price: 4 + Math.random() * 2,
        stock: 30,
        isCustomizable: true,
        categoryId: sandwichs.id,
      },
    })
    sandwichProducts.push(product)
  }

  for (const name of patisserieNames) {
    await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
        image: `/images/${slugify(name)}.jpg`,
        price: 2.5 + Math.random() * 2,
        stock: 40,
        isCustomizable: false,
        categoryId: patisseries.id,
      },
    })
  }

  console.log('🧄 Création des sauces et garnitures...')

  const sauces = [
    "Ketchup", "Mayonnaise", "Samouraï", "Barbecue", "Moutarde", "Algérienne", "Curry", "Tartare", "Pesto", "Blanche"
  ]

  const garnitures = [
    "Olives", "Tomates", "Oignons", "Cornichons", "Salade", "Chèvre", "Poivrons", "Mozzarella", "Aubergines", "Fromage râpé"
  ]

  const createdOptions = []

  for (const sauce of sauces) {
    const opt = await prisma.customizationOption.create({
      data: { name: sauce, type: "SAUCE" }
    })
    createdOptions.push(opt)
  }

  for (const garniture of garnitures) {
    const opt = await prisma.customizationOption.create({
      data: { name: garniture, type: "GARNITURE" }
    })
    createdOptions.push(opt)
  }

  console.log('🔗 Association des options aux sandwichs...')

  await prisma.productCustomization.createMany({
    data: sandwichProducts.flatMap(product =>
      createdOptions.map(option => ({
        productId: product.id,
        customizationOptionId: option.id,
      }))
    ),
  })

  console.log('✅ Base remplie avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur dans le seed :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
