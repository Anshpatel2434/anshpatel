import type { CSSProperties } from "react";
import type { Project } from "../data/projects";

/* ============================================================
   PLATE — a project's image, and its name set over it.

   The image is composed rather than captured: the screenshot is
   reduced to two tones of the project's own colour, with that
   colour spent on a thin seam. The name sits on top in CSS, in the
   same colour, so it stays crisp at any size and can be read even
   while the plate is held back.

   Held back is the resting state. Blurred and washed toward the
   ground until the pointer arrives, then it resolves. The name
   stays put through that, sitting on the wash composed into the
   bottom of the image for exactly that purpose.
   ============================================================ */

type Props = {
  project: Project;
  wide?: boolean;
  /* a band and a project page already carry the name beside the
     plate, so there it stays quiet */
  silent?: boolean;
};

export default function Plate({ project: p, wide = false, silent = false }: Props) {
  const src = wide ? p.shotWide || p.shot : p.shot;
  const style = { "--pk": p.key, "--pi": p.ink } as CSSProperties;

  return (
    <div className={"plate" + (wide ? " plate-w" : "")} style={style}>
      {src ? (
        <img src={src} alt={p.name} loading="lazy" />
      ) : (
        <div className="plate-ph" aria-hidden="true" />
      )}
      <span className="plate-veil" aria-hidden="true" />
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
