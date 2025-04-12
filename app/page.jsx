import Carousel from "@/components/ui/carousel/Carousel";
import ProductCard from "@/components/ui/product-card/ProductCard";

export default function Home() {
  return (
    <main className="px-4 mt-6">
      <Carousel />

      <h2 className="mt-10 mb-5 text-center text-xl font-semibold italic">
        Les incontournables
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ProductCard
          name="Jambon-Beurre"
          category="Sandwich"
          price={3.1}
          imageUrl="/images/random.jpg"
        />
        <ProductCard
          name="Pain au Chocolat"
          category="Viennoiserie"
          price={1.2}
          imageUrl="/images/random.jpg"
        />
        <ProductCard
          name="Poulet Crudités"
          category="Sandwich"
          price={4.0}
          imageUrl="/images/random.jpg"
        />
        <ProductCard
          name="Espresso"
          category="Boisson"
          price={1.8}
          imageUrl="/images/random.jpg"
        />
      </div>
    </main>
  );
}
