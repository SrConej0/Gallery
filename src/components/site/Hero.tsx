import { type HeroContent, heroFallbackImage, isDirectImageUrl } from "@/lib/site";
import { ArrowDown } from "lucide-react";

export function Hero({ content }: { content: HeroContent }) {
  const img = isDirectImageUrl(content.image_url) ? content.image_url : heroFallbackImage;

  const scrollToCollection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const collection = document.getElementById("collection");
    if (collection) {
      collection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-cream via-cream to-stone-soft/40" style={{ minHeight: "min(95vh, 950px)" }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-stone-soft/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-stone-soft/30 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Photo on the right */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[65%]">
        <div className="relative h-full">
          {/* Image frame shadow */}
          <div className="absolute inset-4 bg-gradient-to-tr from-ink/10 to-ink/5 rounded-3xl blur-xl opacity-40"></div>
          
          <img
            src={img}
            alt="Ñalla baby alpaca jacket"
            className="h-full w-full object-cover object-center transition-transform duration-[3000ms] hover:scale-[1.04]"
          />
          
          {/* Gradient overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-l from-cream/80 via-transparent to-transparent opacity-80"></div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1500px] items-center px-6 pt-40 pb-32 lg:px-12" style={{ minHeight: "min(95vh, 950px)" }}>
        <div className="max-w-2xl space-y-10">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.45em] text-ink/60 uppercase">
              {content.eyebrow}
            </p>
            <h1 className="font-serif text-[3.6rem] leading-[1.02] text-ink md:text-[4.8rem] lg:text-[5.2rem]">
              {content.title_line_1}<br />
              <span className="relative inline-block">
                {content.title_line_2}
                <span className="absolute -bottom-3 left-0 w-full h-1.5 bg-gradient-to-r from-ink/20 to-ink/5 rounded-full"></span>
              </span>
            </h1>
          </div>
          
          <p className="max-w-lg text-[17px] leading-relaxed text-ink/70">
            {content.subtitle}
          </p>
          
          <div className="pt-4">
            <a 
              href="#collection" 
              onClick={scrollToCollection} 
              className="group inline-flex items-center gap-3 bg-ink px-8 py-4 text-cream hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:shadow-ink/25"
            >
              <span className="text-[12px] tracking-[0.35em] uppercase font-semibold">
                {content.cta_label}
              </span>
              <ArrowDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <button 
          onClick={(e) => {
            e.preventDefault();
            const collection = document.getElementById("collection");
            if (collection) collection.scrollIntoView({ behavior: "smooth", block: "start" });
          }} 
          className="flex flex-col items-center gap-2 text-ink/40 hover:text-ink/70 transition-colors duration-300 group"
        >
          <span className="text-[10px] tracking-[0.45em] uppercase font-semibold">Descubre</span>
          <div className="mt-1 animate-bounce">
            <ArrowDown className="h-6 w-6" strokeWidth={1.5} />
          </div>
        </button>
      </div>
    </section>
  );
}
