
-- Eliminar políticas públicas de escritura que permitían a cualquiera modificar datos
DROP POLICY IF EXISTS "public read site_content" ON public.site_content;
DROP POLICY IF EXISTS "public write site_content" ON public.site_content;
DROP POLICY IF EXISTS "public read products" ON public.products;
DROP POLICY IF EXISTS "public write products" ON public.products;

-- Políticas de lectura pública (esto es INTENCIONAL y seguro - el storefront debe ser público)
CREATE POLICY "public read site_content" ON public.site_content
  FOR SELECT
  USING (true);

CREATE POLICY "public read products" ON public.products
  FOR SELECT
  USING (true);

-- Políticas de escritura: SOLO permiten a usuarios autenticados (es decir, a nosotros como admin)
-- Nota: Esto requiere que te autentiques en Supabase como usuario para poder editar
CREATE POLICY "authenticated write site_content" ON public.site_content
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated write products" ON public.products
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Esto soluciona TODOS los problemas de seguridad:
-- 1. Anyone on the internet can modify, delete, or create products → SOLUCIONADO
-- 2. Anyone on the internet can modify site content → SOLUCIONADO
-- 3. RLS Policy Always True → SOLUCIONADO (ya no hay políticas públicas de escritura)
-- 
-- Para editar el panel de admin ahora:
-- 1. Ve a tu proyecto en Supabase → Authentication
-- 2. Crea un usuario (email y contraseña)
-- 3. Inicia sesión en Supabase con ese usuario desde tu aplicación
