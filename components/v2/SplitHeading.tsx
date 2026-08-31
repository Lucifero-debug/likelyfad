import { Fragment } from "react";
import { parseHeading } from "@/lib/v2/data";

/* ============================================================================
   A heading from lib/content.ts, with its emphasis rendered by VALUE.

   The copy marks its emphasis with *asterisks* and its hard breaks with a
   newline. v1 ran the marked phrase through the pink-to-purple gradient. That
   gradient is the single most recognisable AI-generated design tell in
   circulation, which is a strange thing to wear on a site whose whole pitch is
   that its output does not read as AI, so it is gone from this page.

   What replaces it costs nothing and says the same thing: the setup sits in
   the dim ink, the phrase that carries the point comes up to the lit one. Two
   values off the same palette, no third colour, and the marked phrase is still
   the thing your eye lands on. The accent stays where the brief put it, on the
   CTA and nowhere else.
   ========================================================================== */
export function SplitHeading({ raw, className = "" }: { raw: string; className?: string }) {
  const parts = parseHeading(raw);
  /* A heading with nothing marked is not a heading that should arrive entirely
     in the dim ink. With no emphasis to carry, the whole line is the emphasis. */
  const marked = parts.some((part) => part.lit);

  return (
    <span className={`${marked ? "text-dim" : "text-lit"} ${className}`}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part.br && <br />}
          {part.lit ? <span className="text-lit">{part.text}</span> : part.text}
        </Fragment>
      ))}
    </span>
  );
}
