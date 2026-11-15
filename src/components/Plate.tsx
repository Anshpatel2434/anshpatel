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
};

export default function Plate({ project: p, wide = false, silent = false }: Props) {
  const rest = wide ? p.coverWideRest || p.coverRest : p.coverRest;
  const live = wide ? p.coverWideLive || p.coverLive : p.coverLive;

  return (
    <div className={"plate" + (wide ? " plate-w" : "")}>
      <img className="plate-live" src={live} alt={p.name} loading="lazy" />
      <img className="plate-rest" src={rest} alt="" aria-hidden="true" loading="lazy" />
      {!silent && (
        <span className="plate-name d-tight" aria-hidden="true">
          {p.name}
        </span>
      )}
      {p.shotNote && (
        <span className="plate-note mono" aria-hidden="true">
          {p.shotNote}
        </span>
      )}
    </div>
  );
}
