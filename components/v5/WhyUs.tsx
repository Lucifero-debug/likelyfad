import { SECTIONS, WHY } from "@/lib/v5/data";
import { ANCHOR, HEAD_GAP, SECTION, T_15, T_20, WRAP } from "@/lib/v5/theme";
import { SectionHead } from "./SectionHead";

/* ============================================================================
   WHY US — three claims, side by side, and NOT numbered.

   THE ABSENCE OF 01 / 02 / 03 IS THE DECISION HERE. The hairline row above
   already carries (03); numbering the three claims inside it would put a second
   index in the same eyeful saying nothing the first one did not. Worse, it
   would assert a sequence: these are three independent reasons and there is no
   order in which you have to accept them. A number that carries no information
   is decoration pretending to be structure. The process section below is the
   proof by contrast — there the order is real, so there the numbers stay.

   WITHOUT NUMBERS THE THREE NEED A DIFFERENT DEVICE, or they read as a run of
   paragraphs. The device is a rule over each one and a claim set at 20 against
   15 body: same shape three times, repeated, which is what makes them read as
   a set rather than as prose that happened to be columned.

   THE SPACING IS THE CASE THE BRIEF CALLS OUT BY NAME. Each claim is padded 32
   at the top, and the gap between them is 48. Padded 32 and spaced 32 they
   would merge into one grid of text; at 48 they are three things. On a phone
   they stack and the same 48 becomes the vertical gap.
   ========================================================================== */
export function WhyUs() {
  return (
    <section
      id="why"
      aria-labelledby="v5-head-why"
      className={`${SECTION} ${ANCHOR} bg-white`}
    >
      <div className={WRAP}>
        <SectionHead index={SECTIONS.why.index} name={SECTIONS.why.name} id="v5-head-why" />

        <ul className={`${HEAD_GAP} grid gap-[48px] tab:grid-cols-3`}>
          {WHY.map((claim) => (
            <li key={claim.title} className="border-t border-crease pt-[32px]">
              <h3 className={`${T_20} text-press`}>{claim.title}</h3>
              <p className={`${T_15} mt-[16px] text-lead`}>{claim.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
