import type { Project } from "../data/projects";

/* ============================================================
   PLATE — two renditions of one cover, cross-faded.

   Underneath sits the project in its own colours, exactly as it
   really looks. Over it sits the same cover redrawn in the page's
   two colours — parchment and umber — blurred and settled into the
   ground, so six projects with six palettes read as one set while
   nobody is looking at them.

   Look at one and the theme layer lifts: its real colours arrive.
   Nothing about a project's colour was changed. It was only held
   back until someone asked.
   ============================================================ */

type Props = {
  project: Project;
  wide?: boolean;
  /* a band and a project page already name the thing beside the
     plate, so there the plate stays quiet */
  silent?: boolean;
  /* on a project's own page the visitor is already looking at that
     project, so there is nothing left to hold back */
  lit?: boolean;
};

export default function Plate({
  project: p,
  wide = false,
  silent = false,
  lit = false,
}: Props) {
  const rest = wide ? p.coverWideRest || p.coverRest : p.coverRest;
  const live = wide ? p.coverWideLive || p.coverLive : p.coverLive;

  return (
    <div
      className={
        "plate" +
        (wide ? " plate-w" : "") +
        (lit ? " lit" : "") +
        (silent ? " quiet" : "")
      }
    >
      {/* The wide cover is drawn at 21:9. A phone shows it in a 16:10
          box, and object-fit then crops the words off both ends — so
          a narrow screen is served the cover drawn for that shape.
          <picture> rather than script, so only one is downloaded. */}
      <picture>
        {wide && <source media="(max-width: 760px)" srcSet={p.coverLive} />}
        <img className="plate-live" src={live} alt={p.name} loading="lazy" />
      </picture>
      <picture>
        {wide && <source media="(max-width: 760px)" srcSet={p.coverRest} />}
        <img className="plate-rest" src={rest} alt="" aria-hidden="true" loading="lazy" />
      </picture>
      {!silent && (
        <span className="plate-name d-tight" aria-hidden="true">
          {p.name}
        </span>
      )}
    </div>
  );
}
