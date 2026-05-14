import type { Tables } from "@/integrations/supabase/types";
import { isDirectImageUrl } from "@/lib/site";
import { useCart } from "@/components/site/Header";
import { ShoppingCart, Plus } from "lucide-react";

export function Collection({ products }: { products: Tables<"products">[] }) {
  const { addItem } = useCart();

  return (
    <section id="collection" className="bg-gradient-to-b from-stone-soft/30 via-cream to-cream py-32">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.45em] text-ink/60 uppercase">The Collection</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.8rem] text-ink leading-tight">
              Quietly Timeless.
            </h2>
            <p className="text-[16px] text-ink/65 max-w-md">
              Descubre nuestra selección exclusiva de piezas artesanales hechas con la mejor alpaca del mundo.
            </p>
          </div>
          <a href="#" className="link-underline text-sm tracking-[0.32em] uppercase font-semibold text-ink/70 hover:text-ink transition-colors">
            Ver todos
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {products.map((p, index) => (
            <article key={p.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-soft rounded-2xl shadow-xl shadow-ink/5 group-hover:shadow-2xl group-hover:shadow-ink/10 transition-all duration-500">
                {isDirectImageUrl(p.image_url ?? "") ? (
                  <img
                    src={p.image_url!}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-all duration-[1200ms] group-hover:scale-[1.08]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink/40">No image</div>
                )}
                
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Add to Cart overlay - center */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <button 
                    onClick={() => addItem({ 
                      id: String(p.id), 
                      name: p.name, 
                      price: Number(p.price), 
                      image_url: p.image_url 
                    })}
                    className="flex items-center gap-2 bg-cream/95 backdrop-blur-sm text-ink px-8 py-4 text-[11px] tracking-[0.32em] uppercase font-semibold shadow-2xl transform scale-95 group-hover:scale-100 transition-all duration-500 hover:bg-ink hover:text-cream"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir al carrito
                  </button>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    {p.category && (
                      <p className="text-[11px] font-semibold tracking-[0.28em] text-ink/55 uppercase">
                        {p.category}
                      </p>
                    )}
                    <h3 className="font-serif text-xl md:text-2xl text-ink leading-tight">
                      {p.name}
                    </h3>
                  </div>
                  <p className="font-serif text-xl md:text-2xl text-ink whitespace-nowrap">
                    € {Number(p.price).toLocaleString()}
                  </p>
                </div>
                
                {p.description && (
                  <p className="text-[14px] leading-relaxed text-ink/65">
                    {p.description}
                  </p>
                )}
                
                {/* Add to Cart button on mobile (always visible) */}
                <button 
                  onClick={() => addItem({ 
                    id: String(p.id), 
                    name: p.name, 
                    price: Number(p.price), 
                    image_url: p.image_url 
                  })}
                  className="mt-4 w-full bg-ink text-cream py-3 text-[11px] tracking-[0.32em] uppercase font-semibold hover:opacity-90 flex items-center justify-center gap-2 lg:hidden transition-all duration-300"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Añadir al carrito
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
