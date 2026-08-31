"use client";

import { CTA } from "@/lib/content";
import { X_HANDLE, contactUrl } from "@/lib/site";
import { STUDIO } from "@/lib/v4/data";
import { useSecond } from "@/lib/v4/useClock";
import { ANCHOR, MONO, RAIL, SECTION, T_12, T_13, WRAP } from "@/lib/v4/theme";

/* ============================================================================
   THE LIVE STATUS PANEL — a contact block that does more work than one.

   WHAT IT IS ACTUALLY FOR. The doubt a brand has about an AI studio is not
   whether the output is good, it is whether there is anybody there. A ticking
   clock in our own timezone, an open status and a stated response time answer
   that in a way a "Get in touch" heading cannot: it says the shop is open and
   somebody is in it.

   WHAT IT DELIBERATELY DOES NOT COPY. The reference site splits its hours into
   "General affairs" and "Offline affairs" and lists a street address and a
   phone number. Reproducing that shape without the studio behind it would be
   borrowed authority. Every row here is something a brand actually needs
   before it sends a brief, and every row is true.

   THE TIMEZONE IS LOAD-BEARING, NOT DECORATIVE. A brand in London or New York
   wants to know whether a DM sent at 2am lands while we are awake. That is the
   whole reason the clock is in IST and says so, rather than showing the
   visitor their own time, which they already have.

   TODO — NO EMAIL. The reference fills this slot and we cannot: lib/site.ts is
   explicit that the X profile is the only real outbound link on this site.
   Nothing is invented, because a fake mailto on a live page is a worse defect
   than a missing row. See STUDIO in lib/v4/data.ts.
   ========================================================================== */

/* Built once. Constructing a formatter per tick is the expensive part of Intl,
   and this one runs every second for as long as the page is open. */
const TIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: STUDIO.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const DATE = new Intl.DateTimeFormat("en-GB", {
  timeZone: STUDIO.timeZone,
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function StatusPanel() {
  /* Null until the browser answers, and that is the whole hydration story: the
     server has no idea what time it is where the reader is standing, so it
     renders the SHAPE of a clock and the browser fills it in. See
     lib/v4/useClock.ts for why this is a store rather than an effect.

     THE PLACEHOLDER IS THE SAME WIDTH AS THE ANSWER. Eight characters either
     way, set in tabular figures, so the row does not resize when the real time
     arrives and does not twitch on the tick from 19:59:59 to 20:00:00. */
  const second = useSecond();
  const now = second === null ? null : new Date(second * 1000);

  /* The clock keeps ticking under reduced motion, deliberately. The preference
     is about movement that can disorient or trigger, not about information
     that updates — freezing it would remove the one thing the panel is for and
     leave a stopped clock claiming the studio is open. */

  return (
    <section id="contact" className={`${SECTION} ${ANCHOR} border-t border-seam`}>
      <div className={WRAP}>
        <div className={RAIL}>
          <h2 className={`${MONO} ${T_12} text-ash`}>Studio</h2>

          {/* Rows, not cards. Each is a hairline-separated pair, which is the
              same device the services list and the process use — on a page
              with no size ramp, repeating one divider is what tells a reader
              that these three sections are the same KIND of thing. */}
          <dl className="border-t border-seam">
            <Row label="Status">
              <span className="flex items-center gap-[8px]">
                {/* One of exactly two accents on this page. A dot rather than
                    coloured text: the word has to stay in the ink so it reads
                    at 13px, and the colour has to be unmissable. */}
                <span aria-hidden="true" className="size-[6px] rounded-full bg-cue" />
                Studio open
              </span>
            </Row>

            <Row label={`Local time (${STUDIO.timeZoneLabel})`}>
              <span className="tabular-nums">
                {now ? TIME.format(now) : "--:--:--"}
                <span className="text-ash"> · </span>
                {now ? DATE.format(now) : " "}
              </span>
            </Row>

            <Row label="Response">First concepts in 48 hours</Row>

            <Row label="Contact">
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-seam transition-colors duration-200 hover:decoration-carbon"
              >
                {CTA} on X, @{X_HANDLE}
              </a>
            </Row>

            <Row label="Based in">
              {STUDIO.city}, {STUDIO.country}
            </Row>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* dt then dd, in that order, which is what a description list requires and
   what a screen reader needs. The label column is fixed so the five values
   line up into a column of their own — with no size contrast available, that
   alignment is the only thing making this read as a table of facts. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[4px] border-b border-seam py-[12px] phone:flex-row phone:gap-[24px]">
      <dt className={`${MONO} ${T_12} text-ash phone:w-[180px] phone:shrink-0`}>{label}</dt>
      <dd className={`${T_13} text-carbon`}>{children}</dd>
    </div>
  );
}
