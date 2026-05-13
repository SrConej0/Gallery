import type { Tables } from "@/integrations/supabase/types";
import { isDirectImageUrl } from "@/lib/site";

export function Collection({ products }: { products: Tables<"products">[] }) {
  return (
    <section id="collection" className="bg-cream py-28">
      <div className="mx-auto max-w-[1500px] px-8">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="mb-4 text-[11px] tracking-[0.32em] text-ink/60">THE COLLECTION</p>
            <h2 className="font-serif text-4xl text-ink md:text-5xl">Quietly Timeless.</h2>
          </div>
          <a href="#" className="link-underline hidden md:inline-block">VIEW ALL</a>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-soft">
                {isDirectImageUrl(p.image_url ?? "") ? (
                  <img
                    src={p.image_url!}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink/40">No image</div>
                )}
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-ink">{p.name}</h3>
                  {p.category && <p className="mt-1 text-[12px] tracking-wide text-ink/55">{p.category}</p>}
                </div>
                <p className="font-serif text-lg text-ink whitespace-nowrap">€ {Number(p.price).toLocaleString()}</p>
              </div>
              {p.description && <p className="mt-3 text-[13px] leading-relaxed text-ink/70">{p.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
