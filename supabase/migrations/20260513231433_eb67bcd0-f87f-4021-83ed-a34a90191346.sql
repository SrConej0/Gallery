
create table public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  category text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.products enable row level security;

-- Public read + write (admin gate is client-side per spec admin/admin123)
create policy "public read site_content" on public.site_content for select using (true);
create policy "public write site_content" on public.site_content for all using (true) with check (true);

create policy "public read products" on public.products for select using (true);
create policy "public write products" on public.products for all using (true) with check (true);

-- Seed default hero content
insert into public.site_content (key, value) values
  ('hero', '{"eyebrow":"HERITAGE. LUXURY. PURPOSE.","title_line_1":"The Finest Alpaca.","title_line_2":"Naturally Refined.","subtitle":"Timeless designs crafted from the world''s finest alpaca. Made to be loved for a lifetime.","cta_label":"DISCOVER COLLECTION","image_url":"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200"}'::jsonb),
  ('brand', '{"name":"ÑALLA","tagline":"Peruvian Heritage"}'::jsonb),
  ('attributes', '[{"label":"100% Baby Alpaca","icon":"sparkles"},{"label":"Sustainable by Nature","icon":"leaf"},{"label":"Ethically Handmade","icon":"heart-handshake"},{"label":"Peruvian Heritage","icon":"mountain"}]'::jsonb);

insert into public.products (name, description, price, image_url, category, sort_order) values
  ('Baby Alpaca Zip Jacket', 'Hand-finished zip jacket in undyed baby alpaca. A wardrobe heirloom.', 890, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200', 'Outerwear', 1),
  ('Andean Wrap Coat', 'Sculpted silhouette woven by Peruvian artisans from royal alpaca.', 1240, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200', 'Outerwear', 2),
  ('Heritage Crewneck', 'A pure baby alpaca crewneck with refined ribbed trims.', 420, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200', 'Knitwear', 3),
  ('Royal Alpaca Turtleneck', 'Luxurious turtleneck in royal alpaca, exceptionally soft and warm.', 580, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200', 'Knitwear', 4),
  ('Alpaca Wool Cardigan', 'Classic button-front cardigan, perfect for layering.', 650, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea8f?w=1200', 'Knitwear', 5),
  ('Luxury Alpaca Scarf', 'Handwoven scarf in premium baby alpaca.', 280, 'https://images.unsplash.com/photo-1558769132-cb1202158259?w=1200', 'Accessories', 6),
  ('Andean Mountain Sweater', 'Timeless sweater inspired by traditional Andean designs.', 520, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1200', 'Knitwear', 7),
  ('Premium Alpaca Vest', 'Elegant vest in ultra-soft royal alpaca.', 480, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200', 'Outerwear', 8),
  ('Cozy Alpaca Pullover', 'Relaxed-fit pullover for ultimate comfort.', 390, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200', 'Knitwear', 9),
  ('Alpaca Wool Cape', 'Dramatic cape in heavyweight alpaca wool.', 780, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200', 'Outerwear', 10),
  ('Luxury Alpaca Throw', 'Decorative throw for the home, in rich alpaca.', 340, 'https://images.unsplash.com/photo-1483985988355-763728e1937b?w=1200', 'Home', 11),
  ('Signature Alpaca Beanie', 'Classic beanie hat in soft baby alpaca.', 120, 'https://images.unsplash.com/photo-1558769132-cb1202158259?w=1200', 'Accessories', 12);
