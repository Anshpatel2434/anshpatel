import Catalogue from "../sections/Catalogue";
import PageHead from "../components/PageHead";

export default function WorkPage() {
  return (
    <>
      <PageHead
        eyebrow="Work"
        title="Everything I have built."
        lead="Newest first, and nothing promoted over anything else — a thing that launched and a thing that did not took the same work to decide. Every name opens the project itself."
      />
      <Catalogue />
    </>
  );
}
