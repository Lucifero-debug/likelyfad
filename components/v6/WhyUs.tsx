import { WHY } from "@/lib/v6/data";
import { ANCHOR, HEAD_GAP, MONO, SECTION, SERIF, SERIF_400, T_12, T_14, T_17, T_24, T_40, WRAP } from "@/lib/v6/theme";

/* ============================================================================
   WHY US — three claims on the open ground.

   NOT CARDS, AND THAT IS THE WHOLE DECISION HERE. The bento grid a section and
   a half above already spent the card treatment, and a second grid of dark
   rounded boxes would turn the page into one texture: at a glance the reader
   would see two identical grids and assume the second was more of the first.
   These sit on the night with space around them and a hairline over each,
   which says "a set of three" using the page's quietest available device.

   NOT NUMBERED EITHER. These are three independent reasons and there is no
   order in which you have to accept them; 01 / 02 / 03 would assert a sequence
   that is not there, and a number carrying no information is decoration
   pretending to be structure. The process section directly below is the proof
   by contrast — there the order is real, so there the numbers stay. Two
   sections that look alike and differ in exactly this respect is the clearest
   way to say that the numbering on this page means something.

   THE SPACING IS DOING THE WORK THE CARDS WOULD HAVE DONE. 48 between the
   three, which is the same gap the bento grid uses, so the two sections agree
   about how far apart three things sit even though only one of them is boxed.
   ========================================================================== */
export function WhyUs() {
  return (
    <section id="why" aria-labelledby="v6-why-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-haze`}>Why us</p>

        <h2 id="v6-why-title" className={`${SERIF} ${T_40} ${HEAD_GAP} max-w-[18ch] text-beam`}>
          {WHY.headline}
        </h2>

        <p className={`${T_17} mt-[24px] max-w-[58ch] text-haze`}>{WHY.sub}</p>

        <ul className="mt-[64px] grid gap-[48px] tab:grid-cols-3">
          {WHY.claims.map((claim) => (
            <li key={claim.title} className="border-t border-edge pt-[32px]">
              <h3 className={`${SERIF_400} ${T_24} max-w-[20ch] text-beam`}>{claim.title}</h3>
              <p className={`${T_14} mt-[16px] text-haze`}>{claim.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
