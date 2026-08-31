import { content } from "@/lib/content";
import { PARENT_COMPANY, SITE_NAME, X_HANDLE } from "@/lib/site";
import { DISPLAY, MONO, SECTION, T_12, T_14, WRAP } from "@/lib/v3/theme";

/* ============================================================================
   THE FOOTER — four columns, on the page colour rather than in a panel.

   It sits directly under the near-black closing panel, so making this dark too
   would merge the two into one very tall black block and the close would stop
   reading as a distinct object. Light, quiet, and clearly the end of the
   document.

   THE COLUMNS ARE NOT lib/content.ts's TWO. That file carries a Studio column
   and a Connect column, which is the homepage's footer. Four is the shape this
   brief asks for, and the two it adds are real: the formats we sell, and who
   we are. No column is padded out with links that go nowhere.
   ========================================================================== */
const COLUMNS = [
  {
    title: "Studio",
    links: content.nav.links,
  },
  {
    title: "Formats",
    links: [
      { label: "Video", href: "#formats" },
      { label: "UGC", href: "#formats" },
      { label: "Static", href: "#formats" },
      { label: "Hooks", href: "#formats" },
    ],
  },
  {
    title: "Connect",
    links: [{ label: `X / @${X_HANDLE}`, href: `https://x.com/${X_HANDLE}`, external: true }],
  },
] as const;

export function Footer() {
  return (
    <footer className={`${SECTION} border-t border-graphite/10`}>
      <div className={`${WRAP} grid gap-[48px] phone:grid-cols-2 lap:grid-cols-4`}>
        <div>
          <p className={`${DISPLAY} text-[1.0625rem] lowercase text-graphite`}>{content.brand}</p>
          <p className={`${T_14} mt-[16px] max-w-[28ch] text-stone`}>{content.footer.tagline}</p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className={`${MONO} ${T_12} text-stone`}>{column.title}</h2>
            <ul className={`${T_14} mt-[24px] flex flex-col gap-[12px]`}>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-graphite transition-colors duration-200 hover:text-stone"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={`${WRAP} ${MONO} ${T_12} mt-[96px] text-stone`}>
        {SITE_NAME} · {PARENT_COMPANY}
      </div>
    </footer>
  );
}
