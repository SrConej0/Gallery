import { supabase } from "@/integrations/supabase/client";
import heroFallback from "@/assets/hero-alpaca.png";

export type HeroContent = {
  eyebrow: string;
  title_line_1: string;
  title_line_2: string;
  subtitle: string;
  cta_label: string;
  image_url: string;
};

export type BrandContent = { name: string; tagline: string };
export type AttributeItem = { label: string; icon: string };

export const defaultHero: HeroContent = {
  eyebrow: "HERITAGE. LUXURY. PURPOSE.",
  title_line_1: "The Finest Alpaca.",
  title_line_2: "Naturally Refined.",
  subtitle: "Timeless designs crafted from the world's finest alpaca. Made to be loved for a lifetime.",
  cta_label: "DISCOVER COLLECTION",
  image_url: "",
};

export const defaultBrand: BrandContent = { name: "ÑALLA", tagline: "Peruvian Heritage" };

export const defaultAttributes: AttributeItem[] = [
  { label: "100% Baby Alpaca", icon: "sparkles" },
  { label: "Sustainable by Nature", icon: "leaf" },
  { label: "Ethically Handmade", icon: "heart-handshake" },
  { label: "Peruvian Heritage", icon: "mountain" },
];

export const heroFallbackImage = heroFallback;

export async function fetchSiteContent() {
  const { data } = await supabase.from("site_content").select("key,value");
  const map = new Map((data ?? []).map((r) => [r.key, r.value as unknown]));
  const hero = { ...defaultHero, ...((map.get("hero") as Partial<HeroContent>) ?? {}) };
  const brand = { ...defaultBrand, ...((map.get("brand") as Partial<BrandContent>) ?? {}) };
  const attributes = (map.get("attributes") as AttributeItem[]) ?? defaultAttributes;
  return { hero, brand, attributes };
}

export async function fetchProducts() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export function isDirectImageUrl(url: string) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(u.pathname);
  } catch {
    return false;
  }
}
