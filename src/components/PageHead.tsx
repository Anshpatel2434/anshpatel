import { Link } from "react-router-dom";

/* The opening block of every inner page: a way back, the section
   name set large, and one line saying what is on the page. */

export default function PageHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="page-head">
      <div className="wrap">
        <Link className="btn ghost back-home" to="/">
          Back to home
        </Link>
        <p className="label">{eyebrow}</p>
        <h1 className="h-lg d-tight page-title">{title}</h1>
        <p className="page-lead say">{lead}</p>
      </div>
    </header>
  );
}
