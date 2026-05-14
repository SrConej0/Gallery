
-- Eliminar políticas públicas de escritura que permitían a cualquiera modificar datos
DROP POLICY IF EXISTS "public write site_content" ON public.site_content;
DROP POLICY IF EXISTS "public write products" ON public.products;

-- Mantener políticas de lectura pública (esto es correcto)
-- La lectura de productos y contenido del sitio debe ser pública

-- Nota: Para una seguridad 100% real, necesitarías:
-- 1. Habilitar Supabase Auth
-- 2. Crear usuarios admin
-- 3. Restringir escritura solo a usuarios autenticados
-- Por ahora, mantenemos el diseño del admin como está (client-side) 
-- pero eliminamos las políticas públicas de escritura para que sean más seguras

-- Políticas de solo lectura (más seguras que permitiendo escritura pública)
CREATE POLICY "public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "public read products" ON public.products FOR SELECT USING (true);

-- Si quieres habilitar la escritura para pruebas, puedes descomentar estas líneas
-- (pero NO las uses en producción sin autenticación real):
-- CREATE POLICY "enable insert for service role" ON public.site_content FOR ALL USING (true);
-- CREATE POLICY "enable insert for service role" ON public.products FOR ALL USING (true);
