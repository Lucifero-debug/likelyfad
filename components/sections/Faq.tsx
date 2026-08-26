import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHOR, HEAD_GAP, SECTION, WRAP } from "@/lib/ui";

const { faq } = content;

/* Head on the left, list on the right, the head sticking as the list scrolls
   past it. Below the tablet breakpoint it collapses to one column and the head
   goes static — a sticky element in a single-column layout just eats the top of
   the screen.

   Native <details>, so the accordion needs no state, no JS and no client
   boundary — and it still opens if a script fails. The only work is hiding the
   two default markers (Safari ships its own ::-webkit-details-marker) and
   drawing our own, which rotates off `group-open`. */
const QUESTION =
  "flex w-full cursor-pointer list-none items-center justify-between gap-6 py-5 text-left " +
  "font-display text-[clamp(1.05rem,1rem+0.5vw,1.3rem)] font-semibold tracking-[-0.01em]" +
  "transition-colors duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-pink-deep active:opacity-60 [&::-webkit-details-marker]:hidden";

const PLUS =
  "relative size-[30px] flex-none rounded-full border-[1.5px] border-line " +
  "transition-[transform,border-color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "group-open:rotate-[135deg] group-open:border-pink";

export function Faq() {
  return (
    <section
      id="faq"
      className={`${SECTION} ${ANCHOR}`}
      aria-label="Frequently asked questions"
    >
      <div
        className={`${WRAP} grid items-start gap-[clamp(32px,5vw,64px)] tab:grid-cols-[0.45fr_0.55fr]`}
      >
        <div className="text-center tab:sticky tab:top-24">
          <div className={HEAD_GAP}>
            <SectionHeading kicker={faq.kicker} heading={faq.heading} />
          </div>
          <Reveal delay={100}>
            <Button contact variant="light" withArrow>
              {faq.cta}
            </Button>
          </Reveal>
        </div>

        {/* The 7px is an OPTICAL nudge, not a measurement of anything. Both
            columns are `items-start`, so their boxes already begin at the same
            y — but the left column starts with TEXT, whose ink sits about that
            far below its own line box (half-leading, plus the gap between the
            ascender line and the cap), while this column starts with a
            hairline, which has no such inset. Without it the rule reads as
            sitting above the kicker rather than level with it. Taste knob: set
            it to 0 to switch the correction off. */}
        <div className="grid tab:mt-[7px]">
          {faq.items.map((item) => (
            <details key={item.q} className="group border-b border-line first:border-t">
              <summary className={QUESTION}>
                <span>{item.q}</span>
                <span className={PLUS} aria-hidden="true">
                  <i className="absolute inset-0 m-auto h-[1.6px] w-[11px] bg-ink group-open:bg-pink" />
                  <i className="absolute inset-0 m-auto h-[11px] w-[1.6px] bg-ink group-open:bg-pink" />
                </span>
              </summary>
              <p className="max-w-[52ch] text-pretty pb-5 text-ink-soft leading-[1.2]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
