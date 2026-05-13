import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, ChevronDown } from "lucide-react";

const NAV = ["Shop", "Collections", "About Ñalla", "Our World", "Journal"];

export function Header({ brandName }: { brandName: string }) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-7">
        <Link to="/" className="font-serif text-3xl tracking-tight text-ink">
          {brandName}
        </Link>

        <nav className="hidden items-center gap-10 text-[13px] tracking-wide text-ink lg:flex">
          {NAV.map((item) => (
            <a key={item} href="#" className="flex items-center gap-1 hover:opacity-60 transition-opacity">
              {item}
              {item === "Shop" && <ChevronDown className="h-3 w-3" strokeWidth={1.5} />}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-[13px] text-ink">
          <button className="hidden items-center gap-1 md:flex hover:opacity-60">EUR € <ChevronDown className="h-3 w-3" strokeWidth={1.5} /></button>
          <button className="hidden items-center gap-1 md:flex hover:opacity-60">EN <ChevronDown className="h-3 w-3" strokeWidth={1.5} /></button>
          <button className="hover:opacity-60"><Search className="h-[18px] w-[18px]" strokeWidth={1.25} /></button>
          <Link to="/admin" className="hover:opacity-60"><User className="h-[18px] w-[18px]" strokeWidth={1.25} /></Link>
          <button className="flex items-center gap-1 hover:opacity-60">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.25} /> 0
          </button>
        </div>
      </div>
    </header>
  );
}
