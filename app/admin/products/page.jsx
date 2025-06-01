"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    image: null,
    isCustomizable: false,
    categoryId: "",
  })
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetch("/api/categories").then(res => res.json()).then(data => {
      setCategories(data)
      if (data.length > 0) setActiveCategory(data[0].id.toString())
    })
  }, [])

  useEffect(() => {
    let url = "/api/products"
    if (activeCategory) url += `?categoryId=${activeCategory}`
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text()
          console.error("Erreur API produits :", err)
          return []
        }
        return res.json()
      })
      .then(setProducts)
      .catch(err => {
        console.error("Erreur de chargement des produits :", err)
      })
  }, [activeCategory])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === "file") {
      setForm(prev => ({ ...prev, [name]: files?.[0] }))
    } else {
      setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success("Produit supprimé")
    } else {
      const error = await res.json()
      toast.error(error.error || "Erreur lors de la suppression")
    }
  }

  const handleAddOrEdit = async () => {
    const { name, price, description, stock, image, isCustomizable, categoryId } = form
    if (!name || !price || !stock || !categoryId) return

    const body = new FormData()
    body.append("name", name)
    body.append("price", price)
    body.append("description", description)
    body.append("stock", stock)
    body.append("isCustomizable", isCustomizable)
    body.append("categoryId", categoryId)
    if (image) body.append("image", image)

    const method = editingProduct ? "PATCH" : "POST"
    const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"

    try {
      const res = await fetch(endpoint, { method, body })
      if (res.ok) {
        const result = await res.json()
        setProducts(prev => editingProduct ? prev.map(p => p.id === result.id ? result : p) : [...prev, result])
        toast.success(editingProduct ? "Produit modifié" : "Produit ajouté")
      } else {
 let message = "Erreur serveur"
try {
  const error = await res.json()
  message = error?.error || message
} catch {
  console.warn("Impossible de lire l'erreur JSON, tentative text brute")
  try {
    message = await res.text()
  } catch {
    message = "Erreur inconnue"
  }
}
toast.error(message)
      }
    } catch (err) {
      toast.error("Erreur inattendue")
      console.error("Erreur handleAddOrEdit :", err)
    }

    setForm({ name: "", price: "", description: "", stock: "", image: null, isCustomizable: false, categoryId: "" })
    setEditingProduct(null)
    setShowModal(false)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      stock: product.stock.toString(),
      image: null,
      isCustomizable: product.isCustomizable,
      categoryId: product.categoryId.toString(),
    })
    setShowModal(true)
  }

  return (
    <main className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produits</h1>
        <button
          onClick={() => {
            setEditingProduct(null)
            setForm({ name: "", price: "", description: "", stock: "", image: null, isCustomizable: false, categoryId: "" })
            setShowModal(true)
          }}
          className="bg-[#8B1E3F] text-white px-4 py-2 rounded-lg hover:bg-[#7B1E3C] inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Ajouter un produit
        </button>
      </div>

      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id.toString())}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ${
              cat.id.toString() === activeCategory
                ? "bg-[#8B1E3F] text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b">Nom</th>
              <th className="px-4 py-3 border-b">Prix</th>
              <th className="px-4 py-3 border-b">Stock</th>
              <th className="px-4 py-3 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.price.toFixed(2)} €</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEditModal(p)} className="text-blue-600 hover:text-blue-800">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
            </h2>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nom" className="w-full border px-3 py-2 rounded mb-3" />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Prix" type="number" step="0.01" className="w-full border px-3 py-2 rounded mb-3" />
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="w-full border px-3 py-2 rounded mb-3" />
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border px-3 py-2 rounded mb-3" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2 rounded mb-3" />
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" name="isCustomizable" checked={form.isCustomizable} onChange={handleChange} />
              Personnalisable
            </label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-4">
              <option value="">Choisir une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Annuler</button>
              <button onClick={handleAddOrEdit} className="px-4 py-2 rounded bg-[#8B1E3F] text-white hover:bg-[#7B1E3C]">
                {editingProduct ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
