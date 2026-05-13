import { Sparkles, Leaf, HeartHandshake, Mountain, type LucideIcon } from "lucide-react";
import type { AttributeItem } from "@/lib/site";

const ICONS: Record<string, LucideIcon> = { sparkles: Sparkles, leaf: Leaf, "heart-handshake": HeartHandshake, mountain: Mountain };

export function AttributesBar({ items }: { items: AttributeItem[] }) {
  return (
    <div className="border-t border-border bg-stone-soft">
      <div className="mx-auto grid max-w-[1500px] grid-cols-2 divide-x divide-border md:grid-cols-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon] ?? Sparkles;
          return (
            <div key={item.label} className="flex items-center justify-center gap-3 px-6 py-6">
              <Icon className="h-5 w-5 text-ink/70" strokeWidth={1.25} />
              <span className="text-[13px] tracking-wide text-ink">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
