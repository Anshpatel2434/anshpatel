import CaseStudies from "../sections/CaseStudies";
import PageHead from "../components/PageHead";

export default function CaseStudiesPage() {
  return (
    <>
      <PageHead
        eyebrow="Case studies"
        title="Built to answer a question."
        lead="Projects made to work something out rather than to ship. No live link — the problem and the decision are the point."
      />
      <CaseStudies full />
    </>
  );
}
