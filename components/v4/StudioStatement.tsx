import { STATEMENT } from "@/lib/v4/data";
import { T_24 } from "@/lib/v4/theme";

/* ============================================================================
   THE STUDIO STATEMENT — this page's replacement for a headline.

   NO HEADING ABOVE IT, and no heading role on it either. It is a paragraph
   because it is a paragraph: plain prose saying what the studio does and who
   for, with no slogan and no value-proposition framing. Marking it up as an h1
   to satisfy a document-outline checklist would be dressing a paragraph in a
   heading's clothes, which is the same error as setting it at 72px.

   The h1 for this page lives on the section that actually names it. The visual
   scale is flat; the document outline is not.

   IT IS RENDERED BY Playground.tsx, not placed after it. On the reference site
   the work sits behind an interaction because its visitors are designers who
   will explore. Ours are marketers deciding in about eight seconds, so this
   comes first in the DOM and sits on top of the canvas — the interaction is
   never the way you find out what we do.

   24px, and that is the largest type on the page. Only 1.6x the body copy, and
   set at 1.35 leading, because a 24px paragraph at tight leading would read as
   a headline whatever its measured size.
   ========================================================================== */
export function StudioStatement() {
  return <p className={`${T_24} text-carbon text-pretty`}>{STATEMENT}</p>;
}
