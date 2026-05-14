import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, ChevronDown, X, Plus, Minus } from "lucide-react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const NAV = ["Shop", "Collections", "About Ñalla", "Our World", "Journal"];

// --- Cart Context ---
type CartItem = { id: string; name: string; price: number; image_url: string | null; quantity: number };
type CartContextType = {
  items: CartItem[];
  cartOpen: boolean;
  addItem: (product: { id: string; name: string; price: number; image_url: string | null }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("nalla_cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("nalla_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: { id: string; name: string; price: number; image_url: string | null }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const newQty = i.quantity + delta;
      return newQty <= 0 ? i : { ...i, quantity: newQty };
    }));
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, cartOpen, addItem, removeItem, updateQuantity, 
      toggleCart: () => setCartOpen(!cartOpen), closeCart: () => setCartOpen(false), 
      totalItems, totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// --- Header Component ---
export function Header({ brandName }: { brandName: string }) {
  const { toggleCart, totalItems } = useCart();

  const scrollToCollection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const collection = document.getElementById("collection");
    if (collection) {
      collection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 lg:px-12 py-8">
          <Link to="/" className="font-serif text-4xl tracking-tight text-ink hover:opacity-80 transition-opacity">
            {brandName}
          </Link>

          <nav className="hidden items-center gap-10 text-[13px] tracking-wide text-ink lg:flex">
            {NAV.map((item) => (
              <a 
                key={item} 
                href="#" 
                onClick={item === "Shop" ? scrollToCollection : undefined}
                className="flex items-center gap-1 hover:opacity-60 transition-opacity duration-300"
              >
                {item}
                {item === "Shop" && <ChevronDown className="h-3 w-3" strokeWidth={1.5} />}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6 text-[13px] text-ink">
            <button className="hidden items-center gap-1 md:flex hover:opacity-60 transition-opacity duration-300">
              EUR € <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
            </button>
            <button className="hidden items-center gap-1 md:flex hover:opacity-60 transition-opacity duration-300">
              EN <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
            </button>
            <button className="hover:opacity-60 transition-all duration-300 hover:scale-110">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <Link 
              to="/admin" 
              className="hover:opacity-60 transition-all duration-300 hover:scale-110"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <button 
              onClick={toggleCart} 
              className="flex items-center gap-1 hover:opacity-60 relative transition-all duration-300 hover:scale-110"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} /> 
              {totalItems > 0 && (
                <span className="absolute -top-3 -right-3 bg-ink text-cream text-[10px] font-semibold h-5 w-5 rounded-full flex items-center justify-center shadow-lg shadow-ink/30">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}

// --- Cart Sidebar ---
function CartSidebar() {
  const { items, cartOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm transition-all duration-300" 
        onClick={closeCart} 
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl shadow-ink/20 transform transition-all duration-500 translate-x-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-border bg-gradient-to-r from-cream to-stone-soft/30">
            <div>
              <h2 className="font-serif text-3xl text-ink">Shopping Cart</h2>
              <p className="text-[12px] tracking-[0.28em] text-ink/55 mt-1 uppercase">
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
            <button 
              onClick={closeCart} 
              className="p-2 hover:bg-stone-soft rounded-full transition-all duration-300 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {items.length === 0 ? (
              <div className="text-center py-24 text-ink/55">
                <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-20" />
                <p className="text-lg font-medium mb-2">Tu carrito está vacío</p>
                <p className="text-sm text-ink/45">¡Descubre nuestra colección!</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-6 group">
                  <div className="w-24 h-32 bg-stone-soft rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-xl transition-all duration-300">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink/20">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-xl text-ink leading-tight">{item.name}</h3>
                      <p className="font-serif text-lg text-ink whitespace-nowrap">
                        € {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-ink/55">
                      Subtotal: € {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3 border border-border rounded-xl bg-cream">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)} 
                          className="p-2 hover:bg-stone-soft rounded-l-xl transition-all duration-300 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)} 
                          className="p-2 hover:bg-stone-soft rounded-r-xl transition-all duration-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-destructive/70 hover:text-destructive font-medium hover:underline underline-offset-4 transition-all duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-8 bg-gradient-to-r from-cream to-stone-soft/30 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-ink/70 text-lg">Total</span>
                <span className="font-serif text-3xl text-ink">€ {totalPrice.toLocaleString()}</span>
              </div>
              <button className="w-full bg-ink py-5 text-cream text-[12px] tracking-[0.35em] uppercase font-semibold hover:opacity-90 transition-all duration-300 shadow-xl shadow-ink/25 hover:shadow-ink/35">
                CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
