import { MONO, T_12 } from "@/lib/v7/theme";
import { HolePunch, Paperclip } from "./Marks";

/* ============================================================================
   THE STICKER — the signature of this page, and the one place the brief says
   to spend the boldness.

   WHAT IT IS FOR. Four format names taped over the hero headline: Video, UGC,
   Static, Hooks. Every competitor puts those four words in a bullet list under
   the fold. Here they are the first thing over the type, as tags pinned to a
   board, because they are what a brand marketer is scanning the top of an ad
   studio's site to find and a pinned tag is read in the same glance as the
   headline rather than after it.

   THE CLIP HANGS OFF THE TOP-LEFT CORNER, which is the detail that sells it.
   A paperclip drawn inside the label is a picture of a paperclip; one crossing
   the edge is a clip holding the label on. It is rotated a little further than
   the label so the two angles disagree slightly, the way two objects put down
   by hand do.

   IT IS OPAQUE, AND THAT IS A CONTRAST DECISION RATHER THAN A STYLE ONE. These
   sit over a scrimmed video, where a translucent chip would put 12px mono type
   on whatever frame happens to be underneath it. White ground, ink type,
   16.6:1, on every frame.

   THE LABEL IS REAL TEXT AND IS NOT aria-hidden. The clip and the punch are
   decoration and are hidden; the four words are the four things we make, and
   they are the one piece of rotated content on the page that carries meaning.
   Which is why the rotation ceiling matters: at 3 degrees a single uppercase
   word is read as level, and these are never more than one word.
   ========================================================================== */
export function Sticker({ label, className = "" }: { label: string; className?: string }) {
  return (
    /* No overflow rule anywhere on this element. The clip is positioned past
       the top-left corner on purpose and clipping it would remove the half
       that makes it read as holding the label on. */
    <span className={`${CHIP} ${className}`}>
      <Paperclip className="absolute -top-[9px] left-[10px] h-[26px] w-[13px] -rotate-[18deg] text-note" />
      <HolePunch className="size-[12px] shrink-0 text-doodle" />
      <span className={`${MONO} ${T_12} text-mark`}>{label}</span>
    </span>
  );
}

/* Held apart from the component so the narrow fallback in Hero.tsx renders the
   identical object without re-spelling it. Tailwind scans source text, so this
   has to be one complete literal rather than pieces joined at runtime. */
const CHIP =
  "relative inline-flex items-center gap-[8px] rounded-[999px] border border-hair bg-card py-[8px] pr-[16px] pl-[14px] shadow-[0_1px_2px_rgba(20,19,16,0.06),0_8px_20px_-10px_rgba(20,19,16,0.35)]";
