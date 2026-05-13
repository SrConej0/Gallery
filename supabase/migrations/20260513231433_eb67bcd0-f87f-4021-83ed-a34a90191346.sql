
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
  ('hero', '{"eyebrow":"HERITAGE. LUXURY. PURPOSE.","title_line_1":"The Finest Alpaca.","title_line_2":"Naturally Refined.","subtitle":"Timeless designs crafted from the world''s finest alpaca. Made to be loved for a lifetime.","cta_label":"DISCOVER COLLECTION","image_url":""}'::jsonb),
  ('brand', '{"name":"ÑALLA","tagline":"Peruvian Heritage"}'::jsonb),
  ('attributes', '[{"label":"100% Baby Alpaca","icon":"sparkles"},{"label":"Sustainable by Nature","icon":"leaf"},{"label":"Ethically Handmade","icon":"heart-handshake"},{"label":"Peruvian Heritage","icon":"mountain"}]'::jsonb);

insert into public.products (name, description, price, image_url, category, sort_order) values
  ('Baby Alpaca Zip Jacket', 'Hand-finished zip jacket in undyed baby alpaca. A wardrobe heirloom.', 890, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200', 'Outerwear', 1),
  ('Andean Wrap Coat', 'Sculpted silhouette woven by Peruvian artisans from royal alpaca.', 1240, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200', 'Outerwear', 2),
  ('Heritage Crewneck', 'A pure baby alpaca crewneck with refined ribbed trims.', 420, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200', 'Knitwear', 3);
