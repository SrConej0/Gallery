import { Link } from "@tanstack/react-router";
import { Instagram, Pin, Facebook, Twitter } from "lucide-react";

export function Footer({ brand }: { brand: { name: string; tagline: string } }) {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-cream to-stone-soft/40 pt-20 pb-12">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="font-serif text-4xl text-ink mb-2">{brand.name}</p>
              <p className="text-[12px] tracking-[0.35em] text-ink/55 uppercase">
                {brand.tagline}
              </p>
            </div>
            
            <p className="text-[15px] text-ink/65 leading-relaxed max-w-md">
              Piezas artesanales de lujo hechas con la mejor alpaca del mundo, diseñadas para durar toda la vida.
            </p>

            {/* Social media */}
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="p-3 bg-cream border border-border rounded-full text-ink/70 hover:text-ink hover:bg-ink hover:text-cream hover:border-ink transition-all duration-300 hover:shadow-lg">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-cream border border-border rounded-full text-ink/70 hover:text-ink hover:bg-ink hover:text-cream hover:border-ink transition-all duration-300 hover:shadow-lg">
                <Pin className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-cream border border-border rounded-full text-ink/70 hover:text-ink hover:bg-ink hover:text-cream hover:border-ink transition-all duration-300 hover:shadow-lg">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-cream border border-border rounded-full text-ink/70 hover:text-ink hover:bg-ink hover:text-cream hover:border-ink transition-all duration-300 hover:shadow-lg">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-semibold tracking-[0.35em] text-ink/60 uppercase">
              Shop
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Toda la colección</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Outerwear</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Knitwear</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Accesorios</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Hogar</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-semibold tracking-[0.35em] text-ink/60 uppercase">
              Soporte
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Contacto</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Envíos</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Devoluciones</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Tallas</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Cuidado</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-semibold tracking-[0.35em] text-ink/60 uppercase">
              Empresa
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Sobre nosotros</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Nuestro proceso</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Sostenibilidad</a></li>
              <li><a href="#" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Prensa</a></li>
              <li><Link to="/admin" className="text-ink/70 hover:text-ink transition-colors duration-300 text-[14px]">Admin</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="pt-10 border-t border-border/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-ink/45">
              © {new Date().getFullYear()} {brand.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-ink/45">
              <a href="#" className="hover:text-ink/70 transition-colors duration-300">Términos y condiciones</a>
              <a href="#" className="hover:text-ink/70 transition-colors duration-300">Política de privacidad</a>
              <a href="#" className="hover:text-ink/70 transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
