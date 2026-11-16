/* ============================================================
   MARKS

   Hairline glyphs, drawn to the same weight as the rules on the
   page — 1.4px on a 24 grid — so they sit beside mono text as
   punctuation rather than as badges. No fills, no brand colours,
   no icon font: they take currentColor like any other letter.
   ============================================================ */

type Props = { name: "github" | "linkedin" | "cv"; };

export default function Mark({ name }: Props) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  if (name === "github") {
    return (
      <svg {...common}>
        {/* the octocat reduced to its silhouette: a head, and the
            tail that hangs off it */}
        <path d="M9 19c-4 1.4-4-2.1-5.6-2.5M15 21v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6.2 0C6.3 2.8 5.3 3.1 5.3 3.1A4.3 4.3 0 0 0 5.2 6.3 4.6 4.6 0 0 0 3.9 9.6c0 4.6 2.8 5.6 5.5 6a2.9 2.9 0 0 0-.8 2.1V21" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" />
        <path d="M7.4 10.6v6.2M7.4 7.5v.1M11.6 16.8v-6.2M11.6 13.2c0-1.4.9-2.3 2.2-2.3s2.3.9 2.3 2.5v3.4" />
      </svg>
    );
  }

  /* cv: a sheet with a rule or two on it */
  return (
    <svg {...common}>
      <path d="M14 3H7a1.6 1.6 0 0 0-1.6 1.6v14.8A1.6 1.6 0 0 0 7 21h10a1.6 1.6 0 0 0 1.6-1.6V7.6Z" />
      <path d="M14 3v4.6h4.6M9 13h6M9 16.6h4" />
    </svg>
  );
}
