import { content } from "@/lib/content";
import { PARENT_COMPANY } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { WRAP } from "@/lib/ui";

const { brand, close, footer } = content;

/* Each link owns a 44px-tall box so the tap target meets the minimum, PLUS a
   gap so adjacent targets do not abut. Those are two different rules and the
   second is easy to miss: 44px boxes stacked flush satisfy the target size
   while leaving only 18px between the link texts, under the ~24pt the HIG asks
   for around borderless controls. 8px puts it at 26px.

   The underline is the non-colour signal that this is a link; the colour shift
   is the polish. Colour alone must not be what carries it. */
const LINK =
  "flex min-h-11 items-center text-white/70 " +
  "transition-[color,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-white hover:underline hover:underline-offset-[0.25em] " +
  "focus-visible:text-white focus-visible:underline focus-visible:underline-offset-[0.25em] " +
  "active:opacity-60";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    /* Dark ground, so everything inside takes the BRIGHT cut of the ramp — the
       paper-safe one goes muddy against near-black. */
    <footer
      className="bg-noir pb-8 pt-[clamp(40px,5vw,64px)] text-white/70"
      aria-label="Footer"
    >
      <div
        className={`${WRAP} flex flex-col items-start gap-6 border-b border-white/10 pb-[clamp(32px,3.8vw,48px)] phone:flex-row phone:flex-wrap phone:items-center phone:justify-between`}
      >
        {/* Direct flex child, so it blockifies and keeps its 22ch measure —
            see the same note in WhyUs. */}
        <RevealText
          as="p"
          text={close.heading}
          tone="bright"
          className="max-w-[22ch] text-pretty font-display text-[clamp(1.65rem,1rem+2.45vw,2.6rem)] font-bold leading-[1.2] tracking-[-0.02em] text-white"
        />
        {/* Right-aligned against the heading so the button lands at the end of
            the reading path. */}
        <Reveal delay={100}>
          <div className="grid justify-items-start gap-3 text-left phone:justify-items-end phone:text-right">
            <Button contact variant="grad" withArrow>
              {close.cta}
            </Button>
            <p className="max-w-[34ch] font-mono text-[0.76rem] tracking-[0.02em] text-white/50">
              {close.sub}
            </p>
          </div>
        </Reveal>
      </div>

      <div
        className={`${WRAP} grid grid-cols-2 gap-[clamp(32px,5vw,64px)] pt-[clamp(32px,3.8vw,48px)] lap:grid-cols-[1.6fr_1fr_1fr]`}
      >
        <div className="col-span-2 lap:col-span-1">
          <a
            href="#top"
            className="bg-[image:var(--grad)] bg-clip-text font-display text-[1.8rem] font-extrabold leading-[1.2] tracking-[-0.03em] text-transparent"
          >
            {brand}
          </a>
          <p className="mt-4 max-w-[30ch] text-white/50">{footer.tagline}</p>
        </div>

        {footer.columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <span className="mb-4 block font-mono text-[0.72rem] uppercase tracking-[0.1em] text-white/50">
              {col.title}
            </span>
            <ul className="grid gap-2">
              {col.links.map((l) => {
                const external = "external" in l && l.external;
                return (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className={LINK}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>

      <div
        className={`${WRAP} mt-[clamp(32px,4vw,40px)] flex flex-col items-start gap-4 border-t border-white/10 pt-6 font-mono text-[0.72rem] text-white/50 phone:flex-row phone:items-center`}
      >
        <span>
          © {year} {brand}. An AI production studio by {PARENT_COMPANY}.
        </span>
      </div>
    </footer>
  );
}
