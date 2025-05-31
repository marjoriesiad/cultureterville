"use client";

import { BarChart, Layers, Package, Users } from "lucide-react"
import AdminCard from "@/components/admin/AdminCard"

export default function AdminDashboard() {
  // À remplacer par des fetch ou des props plus tard
  const stats = {
    revenue: "1245.00 €",
    categories: 5,
    products: 38,
    users: 112,
  }

  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AdminCard title="Ventes" value={"125.50"} icon={BarChart} href="/admin/ventes" />
      <AdminCard title="Catégories" value={"3"} icon={Layers} href="/admin/categories" />
      <AdminCard title="Produits" value={"2"} icon={Package} href="/admin/produits" />
      <AdminCard title="Clients" value={"50"} icon={Users} href="/admin/utilisateurs" />
    </main>
  )
}