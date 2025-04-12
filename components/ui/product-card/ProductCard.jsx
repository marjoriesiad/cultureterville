import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const ProductCard = ({ name, category, price, imageUrl, onAddToCart }) => {
  return (
    <div className="flex items-center justify-between bg-secondary border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
      {/* Partie gauche : image + infos */}
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-between">
          <p className="text-sm text-secondary uppercase tracking-wide">{category}</p>
          <h3 className="text-base font-medium text-text">{name}</h3>
          <p className="text-primary font-semibold">{price.toFixed(2)}€</p>
        </div>
      </div>

      {/* Bouton panier */}
      <button
        onClick={onAddToCart}
        className="p-2 rounded-full text-primary hover:bg-secondary hover:text-primary transition"
        aria-label={`Ajouter ${name} au panier`}
      >
        <Link href="/">
        <ShoppingCart className="w-5 h-5" />
        </Link>
        
      </button>
    </div>
  );
};

export default ProductCard;
