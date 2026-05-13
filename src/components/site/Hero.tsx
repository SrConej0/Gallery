import { type HeroContent, heroFallbackImage, isDirectImageUrl } from "@/lib/site";

export function Hero({ content }: { content: HeroContent }) {
  const img = isDirectImageUrl(content.image_url) ? content.image_url : heroFallbackImage;

  return (
    <section className="relative w-full overflow-hidden bg-cream" style={{ minHeight: "min(92vh, 880px)" }}>
      {/* Photo on the right */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[62%]">
        <img
          src={img}
          alt="Ñalla baby alpaca jacket"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Cream gradient on the left so text is readable, but no white wash on the photo */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-[55%]"
           style={{ background: "linear-gradient(90deg, var(--cream) 60%, color-mix(in oklab, var(--cream) 70%, transparent) 85%, transparent 100%)" }} />

      <div className="relative mx-auto flex max-w-[1500px] items-center px-8 pt-40 pb-32" style={{ minHeight: "min(92vh, 880px)" }}>
        <div className="max-w-xl">
          <p className="mb-10 text-[11px] font-medium tracking-[0.32em] text-ink/70">
            {content.eyebrow}
          </p>
          <h1 className="font-serif text-[3.4rem] leading-[1.05] text-ink md:text-[4.2rem]">
            {content.title_line_1}<br />
            {content.title_line_2}
          </h1>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/75">
            {content.subtitle}
          </p>
          <div className="mt-12">
            <a href="#collection" className="link-underline">{content.cta_label}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
