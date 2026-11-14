import Work from "../sections/Work";
import PageHead from "../components/PageHead";

export default function WorkPage() {
  return (
    <>
      <PageHead
        eyebrow="Work"
        title="Everything I have shipped."
        lead="Live products first, each with the architecture behind it. Projects without a public link live under case studies."
      />
      <Work full />
    </>
  );
}
