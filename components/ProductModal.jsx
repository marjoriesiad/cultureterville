import { useEffect, useState } from "react"
import { X } from "lucide-react"

export default function ProductModal({ product, onClose }) {
  const [customizations, setCustomizations] = useState({ SAUCE: [], GARNITURE: [] })
  const [selectedOptions, setSelectedOptions] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [priceExtra, setPriceExtra] = useState(0)

  useEffect(() => {
    if (product?.isCustomizable) {
      fetch(`/api/product-options?productId=${product.id}`)
        .then(res => res.json())
        .then(data => {
          const grouped = {
            SAUCE: data.filter(opt => opt.type === "SAUCE"),
            GARNITURE: data.filter(opt => opt.type === "GARNITURE"),
          }
          setCustomizations(grouped)

          const preChecked = grouped.GARNITURE.filter(opt =>
            ["Salade", "Tomates"].includes(opt.name)
          ).map(opt => opt.id)
          setSelectedOptions(preChecked)
        })
    }
  }, [product])

  useEffect(() => {
    if (!product?.isCustomizable) return

    const selectedSauces = customizations.SAUCE.filter(opt => selectedOptions.includes(opt.id))
    const selectedGarnitures = customizations.GARNITURE.filter(opt => selectedOptions.includes(opt.id))

    const extraSauceCount = Math.max(0, selectedSauces.length - 1)
    const extraGarnitures = selectedGarnitures.filter(opt => !["Salade", "Tomates"].includes(opt.name))

    const totalExtra = (extraSauceCount + extraGarnitures.length) * 0.5
    setPriceExtra(totalExtra)
  }, [selectedOptions, customizations, product])

  if (!product) return null

  const handleCheckbox = (optionId) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const isSauceExtra = (id) => {
    const selectedSauces = customizations.SAUCE.filter(opt => selectedOptions.includes(opt.id))
    return selectedOptions.includes(id)
      ? false
      : selectedSauces.length >= 1
  }

  const isGarnitureExtra = (name, id) => {
    const isFree = ["Salade", "Tomates"].includes(name)
    return !isFree && !selectedOptions.includes(id)
  }

  const handleAddToCart = () => {
    console.log("Produit ajouté:", { productId: product.id, quantity, options: selectedOptions, supplement: priceExtra })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-4">
          {(product.price + priceExtra).toFixed(2)} € {priceExtra > 0 && <span className="text-sm text-gray-500">(dont {priceExtra.toFixed(2)} € de suppléments)</span>}
        </p>

        {product.isCustomizable ? (
          <div className="flex flex-row gap-6 md:gap-12 mb-6">
            {customizations.SAUCE.length > 0 && (
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Sauces</h3>
                {customizations.SAUCE.map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 mb-1 justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={opt.id}
                        onChange={() => handleCheckbox(opt.id)}
                        checked={selectedOptions.includes(opt.id)}
                        className="accent-[#8B1E3F]"
                      />
                      {opt.name}
                    </div>
                    {isSauceExtra(opt.id) && <span className="text-xs text-gray-500">+0,50€</span>}
                  </label>
                ))}
              </div>
            )}

            {customizations.GARNITURE.length > 0 && (
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Garnitures</h3>
                {customizations.GARNITURE.map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 mb-1 justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={opt.id}
                        onChange={() => handleCheckbox(opt.id)}
                        checked={selectedOptions.includes(opt.id)}
                        className="accent-[#8B1E3F]"
                      />
                      {opt.name}
                    </div>
                    {isGarnitureExtra(opt.name, opt.id) && <span className="text-xs text-gray-500">+0,50€</span>}
                  </label>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantité</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
            />
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full bg-[#8B1E3F] hover:bg-[#7B1E3C] text-white py-2 rounded-xl font-semibold transition"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}
