import Hero from "../sections/Hero";
import Offer from "../sections/Offer";
import Work from "../sections/Work";
import Experience from "../sections/Experience";
import CaseStudies from "../sections/CaseStudies";
import Pipeline from "../sections/Pipeline";

/* The homepage, in the order agreed:
     hero -> what you can hire me for -> work -> corporate
     experience -> case studies -> the stack.
   About lives on its own page; it is not needed here. */

export default function Home() {
  return (
    <>
      <Hero />
      <Offer />
      <Work />
      <Experience />
      <CaseStudies />
      <Pipeline />
    </>
  );
}
