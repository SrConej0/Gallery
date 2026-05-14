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
  defaultProducts,
} from "@/lib/site";
import type { Tables } from "@/integrations/supabase/types";
import { toast, Toaster } from "sonner";
import {
  Eye,
  Image as ImageIcon,
  Trash2,
  Edit,
  Plus,
  Save,
  X,
  MoveUp,
  MoveDown,
  GripVertical,
} from "lucide-react";

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
          className="w-full max-w-sm space-y-6 border border-border bg-card p-10 shadow-lg"
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
      <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-2xl text-ink">ÑALLA</Link>
          <span className="text-[11px] tracking-[0.28em] text-ink/55">ADMIN</span>
        </div>
        <div className="flex items-center gap-6 text-[12px]">
          <Link to="/" className="flex items-center gap-2 text-ink/70 hover:text-ink">
            <Eye className="w-4 h-4" /> Ver sitio
          </Link>
          <button onClick={onLogout} className="text-ink/70 hover:text-ink">Salir</button>
        </div>
      </header>

      <div className="border-b border-border bg-card px-8">
        <div className="flex gap-8">
          {(["content", "products"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 py-4 text-[12px] tracking-[0.22em] ${tab === t ? "border-b-2 border-ink text-ink" : "text-ink/55 hover:text-ink/80"}`}
            >
              {t === "content" ? (
                <>
                  <Edit className="w-4 h-4" /> CONTENIDO
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" /> PRODUCTOS
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
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
    else { toast.success("Contenido guardado exitosamente"); qc.invalidateQueries({ queryKey: ["site"] }); }
  }

  const moveAttrUp = (index: number) => {
    if (index <= 0) return;
    const newAttrs = [...attrs];
    [newAttrs[index - 1], newAttrs[index]] = [newAttrs[index], newAttrs[index - 1]];
    setAttrs(newAttrs);
  };

  const moveAttrDown = (index: number) => {
    if (index >= attrs.length - 1) return;
    const newAttrs = [...attrs];
    [newAttrs[index], newAttrs[index + 1]] = [newAttrs[index + 1], newAttrs[index]];
    setAttrs(newAttrs);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-stone-soft rounded-full" />
        <p className="text-sm text-ink/60">Cargando contenido...</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Edit Section */}
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl text-ink">Editar Contenido</h2>
        </div>

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
            <p className="text-xs text-destructive flex items-center gap-1">
              <span className="text-lg">⚠</span> No parece un enlace directo de imagen.
            </p>
          )}
        </Section>

        <Section title="Barra de atributos">
          <div className="space-y-3">
            {attrs.map((a, i) => (
              <div key={i} className="grid grid-cols-[1fr_140px_auto_auto] gap-3 items-center">
                <input className="border border-border bg-card px-3 py-2 text-sm" value={a.label}
                  onChange={(e) => setAttrs(attrs.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                <select className="border border-border bg-card px-3 py-2 text-sm" value={a.icon}
                  onChange={(e) => setAttrs(attrs.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))}>
                  <option value="sparkles">sparkles</option>
                  <option value="leaf">leaf</option>
                  <option value="heart-handshake">heart-handshake</option>
                  <option value="mountain">mountain</option>
                </select>
                <div className="flex gap-1">
                  <button onClick={() => moveAttrUp(i)} className="p-2 text-xs text-ink/60 hover:text-ink border border-border hover:border-ink disabled:opacity-30" disabled={i === 0}>
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveAttrDown(i)} className="p-2 text-xs text-ink/60 hover:text-ink border border-border hover:border-ink disabled:opacity-30" disabled={i === attrs.length - 1}>
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => setAttrs(attrs.filter((_, j) => j !== i))} className="p-2 text-xs text-ink/60 hover:text-destructive border border-border hover:border-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setAttrs([...attrs, { label: "Nuevo atributo", icon: "sparkles" }])}
            className="flex items-center gap-2 text-xs tracking-wide text-ink/70 hover:text-ink underline-offset-4 hover:underline">
            <Plus className="w-4 h-4" /> Añadir atributo
          </button>
        </Section>

        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-ink px-8 py-3 text-[12px] tracking-[0.28em] text-cream hover:opacity-90 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>
      </div>

      {/* Preview Section */}
      <div className="space-y-8">
        <h2 className="font-serif text-3xl text-ink flex items-center gap-2">
          <Eye className="w-6 h-6" /> Previsualización
        </h2>
        
        {/* Hero Preview */}
        <div className="border border-border bg-card p-6 rounded-lg">
          <h3 className="font-serif text-xl text-ink mb-4">Hero Section</h3>
          <div className="space-y-4">
            <p className="text-[11px] font-medium tracking-[0.32em] text-ink/70">{hero.eyebrow}</p>
            <h1 className="font-serif text-3xl leading-[1.05] text-ink">
              {hero.title_line_1}<br />
              {hero.title_line_2}
            </h1>
            <p className="text-sm leading-relaxed text-ink/75">{hero.subtitle}</p>
            <div className="inline-block text-sm border-b border-ink pb-0.5">{hero.cta_label}</div>
            
            {/* Hero Image Preview */}
            {isDirectImageUrl(hero.image_url) ? (
              <div className="mt-4 aspect-video overflow-hidden rounded-lg bg-stone-soft">
                <img src={hero.image_url} alt="Hero preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="mt-4 aspect-video flex items-center justify-center bg-stone-soft rounded-lg text-xs text-ink/40">
                Sin imagen de hero
              </div>
            )}
          </div>
        </div>

        {/* Brand Preview */}
        <div className="border border-border bg-card p-6 rounded-lg">
          <h3 className="font-serif text-xl text-ink mb-4">Marca</h3>
          <div className="space-y-2">
            <p className="font-serif text-3xl text-ink">{brand.name}</p>
            <p className="text-sm text-ink/60">{brand.tagline}</p>
          </div>
        </div>

        {/* Attributes Preview */}
        <div className="border border-border bg-card p-6 rounded-lg">
          <h3 className="font-serif text-xl text-ink mb-4">Atributos</h3>
          <div className="flex flex-wrap gap-3">
            {attrs.map((a, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-cream rounded-full border border-border">
                <span className="text-ink/70">{a.icon}</span>
                <span className="text-sm text-ink">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Products editor (TABLE VIEW - SUPER EFFICIENT) ---------- */
const importableProducts = [
  { name: "Baby Alpaca Zip Jacket", description: "Hand-finished zip jacket in undyed baby alpaca. A wardrobe heirloom.", price: 890, image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200", category: "Outerwear", sort_order: 1 },
  { name: "Andean Wrap Coat", description: "Sculpted silhouette woven by Peruvian artisans from royal alpaca.", price: 1240, image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200", category: "Outerwear", sort_order: 2 },
  { name: "Heritage Crewneck", description: "A pure baby alpaca crewneck with refined ribbed trims.", price: 420, image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200", category: "Knitwear", sort_order: 3 },
  { name: "Royal Alpaca Turtleneck", description: "Luxurious turtleneck in royal alpaca, exceptionally soft and warm.", price: 580, image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200", category: "Knitwear", sort_order: 4 },
  { name: "Alpaca Wool Cardigan", description: "Classic button-front cardigan, perfect for layering.", price: 650, image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea8f?w=1200", category: "Knitwear", sort_order: 5 },
  { name: "Luxury Alpaca Scarf", description: "Handwoven scarf in premium baby alpaca.", price: 280, image_url: "https://images.unsplash.com/photo-1558769132-cb1202158259?w=1200", category: "Accessories", sort_order: 6 },
  { name: "Andean Mountain Sweater", description: "Timeless sweater inspired by traditional Andean designs.", price: 520, image_url: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1200", category: "Knitwear", sort_order: 7 },
  { name: "Premium Alpaca Vest", description: "Elegant vest in ultra-soft royal alpaca.", price: 480, image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200", category: "Outerwear", sort_order: 8 },
  { name: "Cozy Alpaca Pullover", description: "Relaxed-fit pullover for ultimate comfort.", price: 390, image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200", category: "Knitwear", sort_order: 9 },
  { name: "Alpaca Wool Cape", description: "Dramatic cape in heavyweight alpaca wool.", price: 780, image_url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200", category: "Outerwear", sort_order: 10 },
  { name: "Luxury Alpaca Throw", description: "Decorative throw for the home, in rich alpaca.", price: 340, image_url: "https://images.unsplash.com/photo-1483985988355-763728e1937b?w=1200", category: "Home", sort_order: 11 },
  { name: "Signature Alpaca Beanie", description: "Classic beanie hat in soft baby alpaca.", price: 120, image_url: "https://images.unsplash.com/photo-1558769132-cb1202158259?w=1200", category: "Accessories", sort_order: 12 },
];

type EditableProduct = Partial<Tables<"products">> & { id?: string | number; isNew?: boolean };

function ProductsEditor() {
  const qc = useQueryClient();
  const { data: supabaseProducts, isLoading } = useQuery({ queryKey: ["products"], queryFn: () => supabase.from("products").select("*").order("sort_order", { ascending: true }) });
  
  const [tab, setTab] = useState<"my" | "import">("my");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [editableProducts, setEditableProducts] = useState<EditableProduct[]>([]);

  useEffect(() => {
    if (supabaseProducts?.data) {
      setEditableProducts([...supabaseProducts.data]);
    }
  }, [supabaseProducts?.data]);

  const importSingleProduct = async (product: typeof importableProducts[0], index: number) => {
    setImportingId(index);
    const newSortOrder = (editableProducts.length || 0) + 1;
    const { error } = await supabase.from("products").insert({
      ...product,
      sort_order: newSortOrder,
    });
    setImportingId(null);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`¡"${product.name}" importado exitosamente!`);
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const importAllProducts = async () => {
    if (!confirm("¿Estás seguro? Esto importará TODOS los 12 productos.")) return;
    const { error } = await supabase.from("products").insert(
      importableProducts.map((p, i) => ({ ...p, sort_order: (editableProducts.length || 0) + i + 1 }))
    );
    if (error) toast.error(error.message);
    else {
      toast.success("¡12 productos importados exitosamente!");
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const saveProductInline = async (product: EditableProduct) => {
    if (!product.name) {
      toast.error("Falta el nombre del producto");
      return;
    }
    
    const payload = {
      name: product.name,
      description: product.description ?? null,
      price: Number(product.price ?? 0),
      image_url: product.image_url ?? null,
      category: product.category ?? null,
      sort_order: Number(product.sort_order ?? 0),
    };

    const { error } = product.id && !product.isNew
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    
    if (error) toast.error(error.message);
    else {
      toast.success("Producto guardado");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Producto eliminado");
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const moveProduct = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= editableProducts.length) return;
    
    const product1 = editableProducts[index];
    const product2 = editableProducts[newIndex];
    
    if (!product1.id || !product2.id) return;
    
    const tempSortOrder = product1.sort_order;
    
    // Update both products
    await Promise.all([
      supabase.from("products").update({ sort_order: product2.sort_order }).eq("id", product1.id),
      supabase.from("products").update({ sort_order: tempSortOrder }).eq("id", product2.id),
    ]);
    
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-stone-soft rounded-full" />
        <p className="text-sm text-ink/60">Cargando productos...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {(["my", "import"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-4 px-1 text-[12px] tracking-[0.22em] ${tab === t ? "border-b-2 border-ink text-ink" : "text-ink/55 hover:text-ink/80"}`}
          >
            {t === "my" ? "MIS PRODUCTOS" : "IMPORTAR PRODUCTOS"}
          </button>
        ))}
      </div>

      {tab === "my" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-serif text-3xl text-ink">Productos ({editableProducts.length})</h2>
            <button 
              onClick={() => setEditableProducts([...editableProducts, { name: "", price: 0, sort_order: editableProducts.length + 1, isNew: true, id: Date.now() }])}
              className="flex items-center gap-2 bg-ink px-6 py-2.5 text-[12px] tracking-[0.28em] text-cream hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> NUEVO PRODUCTO
            </button>
          </div>

          {/* TABLE VIEW */}
          <div className="border border-border bg-card rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-soft border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-[11px] tracking-[0.22em] text-ink/60 w-12">Orden</th>
                    <th className="px-4 py-3 text-[11px] tracking-[0.22em] text-ink/60">Imagen</th>
                    <th className="px-4 py-3 text-[11px] tracking-[0.22em] text-ink/60">Nombre</th>
                    <th className="px-4 py-3 text-[11px] tracking-[0.22em] text-ink/60">Categoría</th>
                    <th className="px-4 py-3 text-[11px] tracking-[0.22em] text-ink/60">Precio</th>
                    <th className="px-4 py-3 text-[11px] tracking-[0.22em] text-ink/60 w-40">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {editableProducts.map((p, index) => (
                    <ProductRow 
                      key={String(p.id)} 
                      product={p} 
                      isEditing={editingId === p.id}
                      onEdit={() => setEditingId(p.id)}
                      onSave={() => saveProductInline(p)}
                      onDelete={() => p.id && !p.isNew ? deleteProduct(String(p.id)) : setEditableProducts(editableProducts.filter(x => x.id !== p.id))}
                      onMoveUp={() => moveProduct(index, -1)}
                      onMoveDown={() => moveProduct(index, 1)}
                      isFirst={index === 0}
                      isLast={index === editableProducts.length - 1}
                      onUpdate={(updated) => {
                        setEditableProducts(editableProducts.map(x => x.id === p.id ? { ...x, ...updated } : x));
                      }}
                    />
                  ))}
                  {editableProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-ink/55">
                        No hay productos. Importa o agrega el primero.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Import Tab */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl text-ink">Productos disponibles para importar</h2>
            <div className="flex gap-3">
              <button onClick={importAllProducts}
                className="flex items-center gap-2 bg-stone-soft border border-border px-5 py-2.5 text-[12px] tracking-[0.22em] text-ink hover:bg-stone-soft/80">
                IMPORTAR TODOS LOS 12
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {importableProducts.map((p, index) => (
              <div key={index} className="border border-border bg-card overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-soft">
                  {isDirectImageUrl(p.image_url) ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-ink/20" />
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl text-ink">{p.name}</h3>
                    {p.category && <p className="mt-1 text-[12px] tracking-wide text-ink/55">{p.category}</p>}
                    <p className="mt-2 font-serif text-lg text-ink">€ {p.price.toLocaleString()}</p>
                  </div>
                  
                  {p.description && (
                    <p className="text-[13px] leading-relaxed text-ink/70">{p.description}</p>
                  )}
                  
                  <button 
                    onClick={() => importSingleProduct(p, index)}
                    disabled={importingId === index}
                    className="w-full flex items-center justify-center gap-2 bg-ink py-2.5 text-[12px] tracking-[0.22em] text-cream hover:opacity-90 disabled:opacity-50"
                  >
                    {importingId === index ? (
                      <span className="animate-pulse">IMPORTANDO...</span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> IMPORTAR
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Single Product Row (inline editing) ---------- */
function ProductRow({
  product,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onUpdate,
}: {
  product: EditableProduct;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updated: Partial<EditableProduct>) => void;
}) {
  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <tr className="hover:bg-stone-soft/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={isFirst} className="p-1 hover:bg-stone-soft disabled:opacity-30">
            <MoveUp className="w-3 h-3" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="p-1 hover:bg-stone-soft disabled:opacity-30">
            <MoveDown className="w-3 h-3" />
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        {isDirectImageUrl(product.image_url ?? "") ? (
          <div className="w-12 h-12 rounded overflow-hidden bg-stone-soft">
            <img src={product.image_url!} alt={product.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded bg-stone-soft flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-ink/20" />
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        {isEditing ? (
          <input 
            value={product.name ?? ""} 
            onChange={(e) => onUpdate({ name: e.target.value })} 
            className="border border-border bg-background px-2 py-1 text-sm w-full"
          />
        ) : (
          <span className="font-serif text-lg text-ink">{product.name}</span>
        )}
      </td>
      <td className="px-4 py-3">
        {isEditing ? (
          <input 
            value={product.category ?? ""} 
            onChange={(e) => onUpdate({ category: e.target.value })} 
            className="border border-border bg-background px-2 py-1 text-sm w-full"
            placeholder="Categoría"
          />
        ) : (
          <span className="text-sm text-ink/60">{product.category || "—"}</span>
        )}
      </td>
      <td className="px-4 py-3">
        {isEditing ? (
          <input 
            type="number"
            value={product.price ?? 0} 
            onChange={(e) => onUpdate({ price: Number(e.target.value) })} 
            className="border border-border bg-background px-2 py-1 text-sm w-24"
          />
        ) : (
          <span className="font-serif text-lg text-ink">€ {Number(product.price ?? 0).toLocaleString()}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button onClick={onSave} className="p-2 bg-ink text-cream rounded hover:opacity-90">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={() => onEdit()} className="p-2 text-ink/50 hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={startEditing} className="p-2 text-ink/60 hover:text-ink">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={onDelete} className="p-2 text-destructive/60 hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
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
          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink rounded" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink rounded" />
      )}
    </label>
  );
}
