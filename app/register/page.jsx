"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import "react-toastify/dist/ReactToastify.css"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.")
      return
    } else {
      setPasswordError("")
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const login = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      })

      if (login?.ok) {
        toast.success("Compte créé")
        router.push("/products")
      } else {
        toast.error("Compte créé, mais connexion échouée")
      }
    } else {
      const { error } = await res.json()
      toast.error(error || "Erreur serveur")
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstName" type="text" onChange={handleChange} value={form.firstName} placeholder="Prénom" className="w-full border px-3 py-2 rounded" />
        <input name="lastName" type="text" onChange={handleChange} value={form.lastName} placeholder="Nom" className="w-full border px-3 py-2 rounded" />
        <input name="email" type="email" onChange={handleChange} value={form.email} placeholder="E-mail" className="w-full border px-3 py-2 rounded" />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            value={form.password}
            placeholder="Mot de passe"
            className="w-full border px-3 py-2 rounded pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            onChange={handleChange}
            value={form.confirmPassword}
            placeholder="Confirmer le mot de passe"
            className="w-full border px-3 py-2 rounded pr-10"
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-500">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {passwordError && <p className="text-sm text-red-500 -mt-2">{passwordError}</p>}
        <button type="submit" className="w-full bg-[#8B1E3F] text-white py-2 rounded">S'inscrire</button>
      </form>
    </main>
  )
}
