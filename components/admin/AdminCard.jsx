"use client"

import Link from "next/link"

export default function AdminCard({ title, value, icon: Icon, href }) {
  return (
    <Link
      href={href}
      className="flex flex-col justify-between bg-white border rounded-2xl shadow-md hover:shadow-lg p-6 transition w-full sm:w-1/2 lg:w-1/4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <Icon className="w-6 h-6 text-[#8B1E3F]" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </Link>
  )
}
