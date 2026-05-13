import { Link } from "@tanstack/react-router";

export function Footer({ brand }: { brand: { name: string; tagline: string } }) {
  return (
    <footer className="border-t border-border bg-cream py-14">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-3 px-8 text-center">
        <p className="font-serif text-2xl text-ink">{brand.name}</p>
        <p className="text-[12px] tracking-[0.28em] text-ink/55">{brand.tagline.toUpperCase()}</p>
        <p className="mt-6 text-xs text-ink/45">
          © {new Date().getFullYear()} {brand.name}. All rights reserved. ·{" "}
          <Link to="/admin" className="underline-offset-4 hover:underline">Admin</Link>
        </p>
      </div>
    </footer>
  );
}
