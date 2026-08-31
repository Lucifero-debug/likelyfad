import { CARD, LIFT } from "@/lib/v7/theme";
import { FoldedCorner, Pushpin } from "./Marks";

/* ============================================================================
   THE PINNED CARD — the one object this page is built out of.

   Stats, services, reviews and the pricing sheet are all this component at
   different widths. That is deliberate and it is what keeps the wall reading
   as one wall: five sections that each invented their own card would be five
   sections that happen to share a colour.

   THE PIN OVERHANGS THE CARD, WHICH IS THE WHOLE POINT. It sits at -10px, so
   half of it is off the top edge and half is on the card. A pin drawn fully
   inside the card is a circle printed on paper; a pin crossing the edge is an
   object holding the paper up. Nothing here sets overflow-hidden, because that
   would clip exactly the half that does the work.

   THE FOLD ROUNDS ITS OWN CORNER instead. It is a square sitting in the card's
   bottom-right, and against a 6px card radius a square corner pokes about 2px
   past the curve — visible, and it reads as a rendering bug rather than as a
   fold. Matching the radius on the fold's own corner fixes it without an
   overflow rule that would cost us the pin.

   THE LIFT IS motion-safe. A card that rises on hover is pleasant and it is
   also motion, so a visitor who asked for less of it gets a card that does not
   move. The tilt is NOT gated: a still angle is not motion, and stripping the
   tilts under the preference would hand that visitor a different design rather
   than a calmer one.
   ========================================================================== */
export function PinnedCard({
  children,
  className = "",
  /** A rotation utility from TILT in lib/v7/theme.ts. Omitted means square,
      which is correct wherever the content has to be scanned in a row. */
  tilt = "",
  pin = false,
  fold = false,
  /** Off for the work tiles, which are padded 8 by their own wrapper because
      the clip inside them goes edge to edge. */
  padded = true,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: string;
  pin?: boolean;
  fold?: boolean;
  padded?: boolean;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag className={`${CARD} ${LIFT} ${tilt} ${padded ? "p-[32px]" : ""} ${className}`}>
      {pin && <Pushpin className="absolute -top-[10px] left-[24px] size-[22px]" />}
      {children}
      {fold && <FoldedCorner className="size-[24px] rounded-br-[5px]" />}
    </Tag>
  );
}
