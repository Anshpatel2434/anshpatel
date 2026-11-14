import Experience from "../sections/Experience";
import PageHead from "../components/PageHead";

export default function ExperiencePage() {
  return (
    <>
      <PageHead
        eyebrow="Corporate exposure"
        title="Where I have worked."
        lead="Roles, what each one actually involved, and the competitions and study that run alongside them."
      />
      <Experience />
    </>
  );
}
