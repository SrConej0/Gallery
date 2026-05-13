import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { AttributesBar } from "@/components/site/AttributesBar";
import { Collection } from "@/components/site/Collection";
import { Footer } from "@/components/site/Footer";
import { fetchProducts, fetchSiteContent, defaultBrand, defaultHero, defaultAttributes } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const site = useQuery({ queryKey: ["site"], queryFn: fetchSiteContent });
  const products = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const hero = site.data?.hero ?? defaultHero;
  const brand = site.data?.brand ?? defaultBrand;
  const attributes = site.data?.attributes ?? defaultAttributes;

  return (
    <div className="min-h-screen bg-cream">
      <Header brandName={brand.name} />
      <Hero content={hero} />
      <AttributesBar items={attributes} />
      {products.isLoading ? (
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-8 py-28 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] animate-pulse bg-stone-soft" />
              <div className="h-4 w-3/4 animate-pulse bg-stone-soft" />
              <div className="h-3 w-1/2 animate-pulse bg-stone-soft" />
            </div>
          ))}
        </div>
      ) : (
        <Collection products={products.data ?? []} />
      )}
      <Footer brand={brand} />
    </div>
  );
}
