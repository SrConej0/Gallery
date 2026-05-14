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
  image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200",
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

const defaultProducts = [
  { id: "1", name: "Baby Alpaca Zip Jacket", description: "Hand-finished zip jacket in undyed baby alpaca. A wardrobe heirloom.", price: 890, image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200", category: "Outerwear", sort_order: 1 },
  { id: "2", name: "Andean Wrap Coat", description: "Sculpted silhouette woven by Peruvian artisans from royal alpaca.", price: 1240, image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200", category: "Outerwear", sort_order: 2 },
  { id: "3", name: "Heritage Crewneck", description: "A pure baby alpaca crewneck with refined ribbed trims.", price: 420, image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200", category: "Knitwear", sort_order: 3 },
  { id: "4", name: "Royal Alpaca Turtleneck", description: "Luxurious turtleneck in royal alpaca, exceptionally soft and warm.", price: 580, image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200", category: "Knitwear", sort_order: 4 },
  { id: "5", name: "Alpaca Wool Cardigan", description: "Classic button-front cardigan, perfect for layering.", price: 650, image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea8f?w=1200", category: "Knitwear", sort_order: 5 },
  { id: "6", name: "Luxury Alpaca Scarf", description: "Handwoven scarf in premium baby alpaca.", price: 280, image_url: "https://images.unsplash.com/photo-1558769132-cb1202158259?w=1200", category: "Accessories", sort_order: 6 },
  { id: "7", name: "Andean Mountain Sweater", description: "Timeless sweater inspired by traditional Andean designs.", price: 520, image_url: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1200", category: "Knitwear", sort_order: 7 },
  { id: "8", name: "Premium Alpaca Vest", description: "Elegant vest in ultra-soft royal alpaca.", price: 480, image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200", category: "Outerwear", sort_order: 8 },
  { id: "9", name: "Cozy Alpaca Pullover", description: "Relaxed-fit pullover for ultimate comfort.", price: 390, image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200", category: "Knitwear", sort_order: 9 },
  { id: "10", name: "Alpaca Wool Cape", description: "Dramatic cape in heavyweight alpaca wool.", price: 780, image_url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200", category: "Outerwear", sort_order: 10 },
  { id: "11", name: "Luxury Alpaca Throw", description: "Decorative throw for the home, in rich alpaca.", price: 340, image_url: "https://images.unsplash.com/photo-1483985988355-763728e1937b?w=1200", category: "Home", sort_order: 11 },
  { id: "12", name: "Signature Alpaca Beanie", description: "Classic beanie hat in soft baby alpaca.", price: 120, image_url: "https://images.unsplash.com/photo-1558769132-cb1202158259?w=1200", category: "Accessories", sort_order: 12 },
];

export async function fetchProducts() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  
  // Use Supabase data if available and has products, otherwise use default products
  if (data && data.length > 0) {
    return data;
  }
  return defaultProducts as any;
}

export function isDirectImageUrl(url: string) {
  if (!url) return false;
  try {
    const u = new URL(url);
    // Accept Unsplash URLs (they have ?w=xxx parameters) and direct image URLs
    if (u.hostname.includes("unsplash.com") || 
        u.hostname.includes("postimg.cc") ||
        u.hostname.includes("postimages.org") ||
        /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(u.pathname)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
