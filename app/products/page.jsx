"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import ProductModal from "@/components/ProductModal"


export default function ProductPage() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  // 🔄 Fetch des catégories au chargement
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        if (data.length > 0) {
          setActiveCategory(data[0].slug) // active par défaut : 1ère catégorie
        }
      })
  }, [])

  // 🔄 Fetch des produits à chaque changement de catégorie
  useEffect(() => {
    if (!activeCategory) return
    fetch(`/api/products?category=${activeCategory}`)
      .then((res) => res.json())
      .then(setProducts)
  }, [activeCategory])

  return (
    <main className="p-4">
      {/* Catégories */}
      <div className="flex overflow-x-auto snap-x gap-3 pb-4 scrollbar-thin scrollbar-thumb-red custom-scroll">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`min-w-fit snap-center px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
              cat.slug === activeCategory
                ? "bg-red text-beige shadow-sm"
                : "bg-white border-gray text-gray-700 hover:bg-gray hover:text-beige"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Produits */}
      <div className="flex flex-col gap-4 mt-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800">{product.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-md font-medium text-gray-600">{product.price.toFixed(2)}€</p>
              <button
                onClick={() => setSelectedProduct(product)}
                className="bg-red text-beige p-2 rounded-full transition flex items-center justify-center cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modale produit */}
     <ProductModal
  product={selectedProduct}
  onClose={() => setSelectedProduct(null)}
/>
    </main>
  )
}