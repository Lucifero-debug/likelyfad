import type { ReactNode } from "react";
import { contactUrl } from "@/lib/site";

type Variant = "grad" | "dark" | "ghost" | "light";
type Size = "default" | "compact";

/* Buttons hold still. Hover changes colour, border and shadow only — nothing
   moves, slides or wipes, so the CTA reads as a control rather than a toy.
   `active:opacity` is the press state, and the only one a touch device ever
   reaches. It runs faster than the rest: press feedback has to feel immediate.

   700, not 600: Roboto has no 600, so the browser resolves it up to 700 anyway.
*/
/* WIDTH ONLY — the border COLOUR belongs to the variant, and every variant must
   name one. `border-transparent` used to live here, and it silently beat the
   variants: Tailwind emits `.border-transparent` after `.border-ink` and
   `.border-line`, all three are single-class selectors of equal specificity, so
   the last one written to the stylesheet wins no matter what order the classes
   sit in on the element. The outlined variants were rendering with an invisible
   border because of it. One border-color utility per button, no exceptions. */
const BASE =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full " +
  "border font-sans font-bold tracking-[-0.01em] active:opacity-[0.88] " +
  "transition-[color,background-color,border-color,box-shadow] duration-[280ms] " +
  "ease-[cubic-bezier(0.22,0.7,0.2,1)]";

/* Padding and type size travel together in one table rather than being merged
   in from a className: two competing px-* utilities have equal specificity and
   Tailwind emits them in scale order, so the larger would win whatever order
   the caller wrote them in.

   `compact` is the nav CTA on a phone — next to a 40px wordmark a full-size
   button is the loudest thing on the bar. It reverts at the tablet breakpoint,
   the same one where the nav links come back, so the bar changes shape exactly
   once. Both steps clear the 44px minimum: 0.875rem of Roboto on a 1.6
   line-height is 22.4px, so py-3 puts the compact button at ~46px.

   `min-h-[44px]` STATES that floor instead of leaving it to arithmetic. The
   height above is DERIVED from the body leading, so an edit to that leading
   resizes this button with nothing in this file touched: taking the page to
   1.2 once put the compact CTA at 43px, under the floor, silently. */
const SIZES: Record<Size, string> = {
  default: "px-6 py-4 text-[0.96rem]",
  compact: "min-h-[44px] px-4 py-3 text-[0.875rem] tab:px-6 tab:py-4 tab:text-[0.96rem]",
};

const VARIANTS: Record<Variant, string> = {
  grad:
    "border-transparent bg-[image:var(--grad)] text-white " +
    "shadow-[0_12px_30px_-12px_rgba(236,72,153,0.6)] hover:shadow-[var(--shadow-pink)]",
  dark: "border-transparent bg-ink text-paper hover:shadow-[var(--shadow-pink)]",
  /* Full-strength ink rather than the hairline the `light` variant uses: this
     one sits beside the gradient CTA in the hero and needs enough weight to
     read as the second half of a pair. */
  ghost: "border-ink bg-transparent text-ink hover:border-pink hover:text-pink-deep",
  light:
    "border-line bg-white text-ink hover:border-pink hover:text-pink-deep " +
    "hover:shadow-[var(--shadow-sm)]",
};

type ButtonBase = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  withArrow?: boolean;
  ariaLabel?: string;
};

/* href used to default to "#" in v1, which meant a Button with no destination
   rendered a link that silently went nowhere. The union makes that
   unrepresentable: either it is the DM CTA, or it says where it goes. */
type ButtonProps = ButtonBase &
  (
    | { /** The DM CTA — opens the X profile in a new tab. */ contact: true; href?: never }
    | { contact?: false; /** Destination, or an in-page anchor (#id). */ href: string }
  );

export function Button({
  children,
  href,
  variant = "grad",
  size = "default",
  className = "",
  withArrow = false,
  contact = false,
  ariaLabel,
}: ButtonProps) {
  // The union guarantees href is present whenever contact is not set.
  const finalHref = contact ? contactUrl() : (href as string);

  return (
    <a
      href={finalHref}
      className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      target={contact ? "_blank" : undefined}
      rel={contact ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel ?? (contact ? "Send us a DM on X" : undefined)}
    >
      <span>{children}</span>
      {withArrow && <span aria-hidden="true">→</span>}
    </a>
  );
}
