import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHOR, SECTION, WRAP } from "@/lib/ui";

const { why } = content;

/* The gradient hairline that draws itself across the top of a card on hover.
   `before` rather than a border, so it can grow from the left instead of
   appearing all at once. */
const PILLAR =
  "relative h-full overflow-hidden rounded-2xl border border-line bg-white " +
  "p-[clamp(24px,2.5vw,32px)] " +
  "transition-[transform,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow)] " +
  "before:absolute before:left-0 before:top-0 before:h-[3px] before:w-full before:content-[''] " +
  "before:origin-left before:scale-x-0 before:bg-[image:var(--grad)] " +
  "before:transition-transform before:duration-[280ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "hover:before:scale-x-100";

/* Two corner washes on warm paper rather than a flat tint: the flame stop
   enters top-left, the violet stop leaves bottom-right, so the band carries the
   gradient's direction without competing with the type sitting on it. */
const CLAIM_BG =
  "bg-[radial-gradient(90%_130%_at_10%_0%,rgba(255,106,61,0.1),rgba(255,106,61,0)_55%),radial-gradient(90%_130%_at_95%_100%,rgba(138,79,224,0.1),rgba(138,79,224,0)_55%),var(--color-paper-2)]";

export function WhyUs() {
  return (
    <section id="why" className={`${SECTION} ${ANCHOR}`} aria-label={why.kicker}>
      <div className={WRAP}>
        <div className="mb-3 text-center">
          {/* Tighter leading than the 1.04 the display sizes share — this
              heading and the hero's are the two that set large enough for it
              to read as deliberate rather than as cramped. */}
          <SectionHeading kicker={why.kicker} heading={why.heading} leading="0.82" />
          <Reveal delay={100}>
            <p className="mx-auto mt-6 max-w-[54ch] text-pretty text-[clamp(1.1rem,1rem+0.6vw,1.38rem)] leading-[1.5] text-ink-soft">
              {why.lead}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 phone:grid-cols-2 lap:grid-cols-3">
          {why.pillars.map((p, i) => (
            /* Stagger runs across the ROW, not the whole grid: at 6 × 70ms the
               last card would still be arriving long after the reader got
               there. It resets every three so no card waits more than 140ms. */
            <Reveal key={p.title} delay={(i % 3) * 70} className="h-full">
              <article className={PILLAR}>
                <span className="font-mono text-[0.8rem] text-pink-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-balance font-display text-[1.28rem] font-bold leading-[1.03] tracking-[-0.025em]">
                  {p.title}
                </h3>
                <p className="mt-2 text-pretty text-[0.98rem] text-ink-soft">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* The argument, not a card in the grid — so it gets the wider padding,
            the tinted ground and the larger radius. */}
        <div
          className={`mt-[clamp(12px,4vw,48px)] flex flex-col items-center gap-6 rounded-3xl border border-line p-[clamp(32px,3.5vw,48px)] text-center ${CLAIM_BG}`}
        >
          {/* A DIRECT flex child, deliberately: `display: inline` on a flex
              item blockifies, which is what lets the 26ch measure apply. Wrap
              it in a Reveal <div> and the div becomes the flex item, the <p>
              stays inline, and the measure is silently dropped. */}
          <RevealText
            as="p"
            text={why.claim}
            stagger={30}
            className="max-w-[26ch] text-pretty font-display text-[clamp(2.1rem,1.25rem+3.4vw,3.7rem)] font-bold leading-[1.04] tracking-[-0.022em]"
          />
          <Reveal delay={100}>
            <Button contact variant="dark" withArrow>
              {why.claimCta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
