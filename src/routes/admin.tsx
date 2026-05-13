import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchProducts,
  fetchSiteContent,
  defaultHero,
  defaultBrand,
  defaultAttributes,
  isDirectImageUrl,
  type HeroContent,
  type BrandContent,
  type AttributeItem,
} from "@/lib/site";
import type { Tables } from "@/integrations/supabase/types";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/admin")({ component: AdminPage, ssr: false });

const SESSION_KEY = "nalla_admin_session";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "ok") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6">
        <Toaster position="top-center" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (user === "admin" && pass === "admin123") {
              sessionStorage.setItem(SESSION_KEY, "ok");
              setAuthed(true);
            } else toast.error("Credenciales incorrectas");
          }}
          className="w-full max-w-sm space-y-6 border border-border bg-card p-10"
        >
          <div className="text-center">
            <h1 className="font-serif text-3xl text-ink">ÑALLA</h1>
            <p className="mt-2 text-[11px] tracking-[0.32em] text-ink/60">ADMIN PANEL</p>
          </div>
          <label className="block">
            <span className="text-xs tracking-wide text-ink/70">Usuario</span>
            <input value={user} onChange={(e) => setUser(e.target.value)} autoFocus className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink" />
          </label>
          <label className="block">
            <span className="text-xs tracking-wide text-ink/70">Contraseña</span>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink" />
          </label>
          <button className="w-full bg-ink py-3 text-[12px] tracking-[0.28em] text-cream hover:opacity-90">ENTRAR</button>
          <p className="text-center text-[11px] text-ink/50">Demo: admin / admin123</p>
          <Link to="/" className="block text-center text-[11px] text-ink/60 underline-offset-4 hover:underline">← Volver al sitio</Link>
        </form>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"content" | "products">("content");
  return (
    <div className="min-h-screen bg-cream">
      <Toaster position="top-center" />
      <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-2xl text-ink">ÑALLA</Link>
          <span className="text-[11px] tracking-[0.28em] text-ink/55">ADMIN</span>
        </div>
        <div className="flex items-center gap-6 text-[12px]">
          <Link to="/" className="text-ink/70 hover:text-ink">Ver sitio →</Link>
          <button onClick={onLogout} className="text-ink/70 hover:text-ink">Salir</button>
        </div>
      </header>

      <div className="border-b border-border bg-card px-8">
        <div className="flex gap-8">
          {(["content", "products"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-4 text-[12px] tracking-[0.22em] ${tab === t ? "border-b-2 border-ink text-ink" : "text-ink/55"}`}
            >
              {t === "content" ? "CONTENIDO" : "PRODUCTOS"}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-8 py-12">
        {tab === "content" ? <ContentEditor /> : <ProductsEditor />}
      </div>
    </div>
  );
}

/* ---------- Content editor ---------- */
function ContentEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site"], queryFn: fetchSiteContent });
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [brand, setBrand] = useState<BrandContent>(defaultBrand);
  const [attrs, setAttrs] = useState<AttributeItem[]>(defaultAttributes);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) { setHero(data.hero); setBrand(data.brand); setAttrs(data.attributes); }
  }, [data]);

  async function save() {
    if (hero.image_url && !isDirectImageUrl(hero.image_url)) {
      toast.error("La URL del hero debe terminar en .jpg, .png, .webp...");
      return;
    }
    setSaving(true);
    const rows = [
      { key: "hero", value: hero as never },
      { key: "brand", value: brand as never },
      { key: "attributes", value: attrs as never },
    ];
    const { error } = await supabase.from("site_content").upsert(rows);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Contenido guardado"); qc.invalidateQueries({ queryKey: ["site"] }); }
  }

  if (isLoading) return <p className="text-sm text-ink/60">Cargando…</p>;

  return (
    <div className="space-y-12">
      <Section title="Marca">
        <Field label="Nombre" value={brand.name} onChange={(v) => setBrand({ ...brand, name: v })} />
        <Field label="Tagline" value={brand.tagline} onChange={(v) => setBrand({ ...brand, tagline: v })} />
      </Section>

      <Section title="Hero">
        <Field label="Texto superior (eyebrow)" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
        <Field label="Título — línea 1" value={hero.title_line_1} onChange={(v) => setHero({ ...hero, title_line_1: v })} />
        <Field label="Título — línea 2" value={hero.title_line_2} onChange={(v) => setHero({ ...hero, title_line_2: v })} />
        <Field label="Subtítulo" value={hero.subtitle} onChange={(v) => setHero({ ...hero, subtitle: v })} textarea />
        <Field label="Texto del botón" value={hero.cta_label} onChange={(v) => setHero({ ...hero, cta_label: v })} />
        <Field
          label="URL imagen hero (postimages — debe terminar en .jpg/.png)"
          value={hero.image_url}
          onChange={(v) => setHero({ ...hero, image_url: v })}
          placeholder="https://i.postimg.cc/.../foto.jpg"
        />
        {hero.image_url && !isDirectImageUrl(hero.image_url) && (
          <p className="text-xs text-destructive">⚠ No parece un enlace directo de imagen.</p>
        )}
      </Section>

      <Section title="Barra de atributos">
        {attrs.map((a, i) => (
          <div key={i} className="grid grid-cols-[1fr_180px_auto] gap-3">
            <input className="border border-border bg-card px-3 py-2 text-sm" value={a.label}
              onChange={(e) => setAttrs(attrs.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
            <select className="border border-border bg-card px-3 py-2 text-sm" value={a.icon}
              onChange={(e) => setAttrs(attrs.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))}>
              <option value="sparkles">sparkles</option>
              <option value="leaf">leaf</option>
              <option value="heart-handshake">heart-handshake</option>
              <option value="mountain">mountain</option>
            </select>
            <button onClick={() => setAttrs(attrs.filter((_, j) => j !== i))} className="px-3 text-xs text-ink/60 hover:text-destructive">Eliminar</button>
          </div>
        ))}
        <button onClick={() => setAttrs([...attrs, { label: "Nuevo atributo", icon: "sparkles" }])}
          className="text-xs tracking-wide text-ink/70 underline-offset-4 hover:underline">+ Añadir atributo</button>
      </Section>

      <button onClick={save} disabled={saving}
        className="bg-ink px-8 py-3 text-[12px] tracking-[0.28em] text-cream hover:opacity-90 disabled:opacity-50">
        {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
      </button>
    </div>
  );
}

/* ---------- Products editor ---------- */
function ProductsEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const [editing, setEditing] = useState<Partial<Tables<"products">> | null>(null);

  async function save(p: Partial<Tables<"products">>) {
    if (!p.name) { toast.error("Falta el nombre"); return; }
    if (p.image_url && !isDirectImageUrl(p.image_url)) {
      toast.error("La URL debe terminar en .jpg, .png, .webp..."); return;
    }
    const payload = {
      name: p.name,
      description: p.description ?? null,
      price: Number(p.price ?? 0),
      image_url: p.image_url ?? null,
      category: p.category ?? null,
      sort_order: Number(p.sort_order ?? 0),
    };
    const { error } = p.id
      ? await supabase.from("products").update(payload).eq("id", p.id)
      : await supabase.from("products").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Producto guardado"); setEditing(null); qc.invalidateQueries({ queryKey: ["products"] }); }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Eliminado"); qc.invalidateQueries({ queryKey: ["products"] }); }
  }

  if (isLoading) return <p className="text-sm text-ink/60">Cargando…</p>;

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ name: "", price: 0, sort_order: (data?.length ?? 0) + 1 })}
          className="bg-ink px-6 py-2.5 text-[12px] tracking-[0.28em] text-cream hover:opacity-90">+ NUEVO PRODUCTO</button>
      </div>

      <div className="divide-y divide-border border border-border bg-card">
        {(data ?? []).map((p) => (
          <div key={p.id} className="flex items-center gap-4 px-5 py-4">
            <div className="h-16 w-16 flex-shrink-0 bg-stone-soft">
              {isDirectImageUrl(p.image_url ?? "") && <img src={p.image_url!} className="h-full w-full object-cover" alt="" />}
            </div>
            <div className="flex-1">
              <p className="font-serif text-base text-ink">{p.name}</p>
              <p className="text-xs text-ink/55">{p.category ?? "—"} · € {Number(p.price).toLocaleString()}</p>
            </div>
            <button onClick={() => setEditing(p)} className="text-xs text-ink hover:underline">Editar</button>
            <button onClick={() => remove(p.id)} className="text-xs text-destructive hover:underline">Eliminar</button>
          </div>
        ))}
        {(data?.length ?? 0) === 0 && <p className="px-5 py-10 text-center text-sm text-ink/55">Sin productos todavía.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-xl space-y-5 border border-border bg-card p-8">
            <h3 className="font-serif text-2xl text-ink">{editing.id ? "Editar producto" : "Nuevo producto"}</h3>
            <Field label="Nombre" value={editing.name ?? ""} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Field label="Categoría" value={editing.category ?? ""} onChange={(v) => setEditing({ ...editing, category: v })} />
            <Field label="Descripción" value={editing.description ?? ""} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Precio (€)" value={String(editing.price ?? 0)} onChange={(v) => setEditing({ ...editing, price: Number(v) })} />
              <Field label="Orden" value={String(editing.sort_order ?? 0)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />
            </div>
            <Field
              label="URL imagen (postimages — debe terminar en .jpg/.png)"
              value={editing.image_url ?? ""}
              onChange={(v) => setEditing({ ...editing, image_url: v })}
              placeholder="https://i.postimg.cc/.../producto.jpg"
            />
            {editing.image_url && !isDirectImageUrl(editing.image_url) && (
              <p className="text-xs text-destructive">⚠ El enlace no parece directo (debe terminar en .jpg, .png, .webp).</p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-[12px] tracking-[0.22em] text-ink/70 hover:text-ink">CANCELAR</button>
              <button onClick={() => save(editing)} className="bg-ink px-6 py-2.5 text-[12px] tracking-[0.28em] text-cream hover:opacity-90">GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small UI primitives ---------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, textarea, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] tracking-[0.18em] text-ink/60">{label.toUpperCase()}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink" />
      )}
    </label>
  );
}
