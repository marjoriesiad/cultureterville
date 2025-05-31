"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    fetch("/api/categories/with-count")
      .then((res) => res.json())
      .then(setCategories)
  }, [])

  const handleDelete = async (id, productCount) => {
    let message = "Supprimer cette catégorie ?"
    if (productCount > 0) {
      message = `Cette catégorie contient ${productCount} produit(s).\n\nVoulez-vous aussi supprimer tous les produits associés ?`
    }

    const confirmed = confirm(message)
    if (!confirmed) return

    const res = await fetch(`/api/categories/${id}?force=${productCount > 0}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
      toast.success("Catégorie supprimée")
    } else {
      const error = await res.json()
      toast.error(error.error || "Erreur lors de la suppression")
    }
  }

  const handleAddOrEditCategory = async () => {
    if (!newCategory.trim()) return

    if (editingCategory) {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })

      if (res.ok) {
        const updated = await res.json()
        setCategories(prev =>
          prev.map(cat => (cat.id === updated.id ? { ...cat, name: updated.name } : cat))
        )
        toast.success("Catégorie modifiée avec succès !")
      } else {
        const error = await res.json()
        toast.error(error.error || "Erreur serveur")
      }
    } else {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })

      if (res.ok) {
        const cat = await res.json()
        setCategories(prev => [...prev, { ...cat, productCount: 0 }])
        toast.success("Catégorie ajoutée avec succès !")
      } else {
        const error = await res.json()
        toast.error(error.error || "Erreur serveur")
      }
    }

    setNewCategory("")
    setEditingCategory(null)
    setShowModal(false)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setNewCategory(category.name)
    setShowModal(true)
  }

  return (
    <main className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Catégories</h1>
        <button
          onClick={() => {
            setEditingCategory(null)
            setNewCategory("")
            setShowModal(true)
          }}
          className="bg-[#8B1E3F] text-white px-4 py-2 rounded-lg hover:bg-[#7B1E3C] inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Ajouter une catégorie
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b">Nom</th>
              <th className="px-4 py-3 border-b">Produits</th>
              <th className="px-4 py-3 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3">{cat.productCount}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.productCount)}
                    className="inline-flex items-center text-red-600 hover:text-red-800"
                  >
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
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">
              {editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Nom de la catégorie"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setNewCategory("")
                  setEditingCategory(null)
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleAddOrEditCategory}
                className="px-4 py-2 rounded bg-[#8B1E3F] text-white hover:bg-[#7B1E3C]"
              >
                {editingCategory ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
