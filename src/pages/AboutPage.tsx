import About from "../sections/About";
import PageHead from "../components/PageHead";

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="About"
        title="Who you would be hiring."
        lead="The short version is on every other page. This is the longer one — what I work on, why I work that way, and what I have shipped before."
      />
      <About />
    </>
  );
}
