import Hero from "../sections/Hero";
import Offer from "../sections/Offer";
import Work from "../sections/Work";
import Experience from "../sections/Experience";
import Unshipped from "../sections/Unshipped";
import Pipeline from "../sections/Pipeline";

/* The homepage, in the order agreed:
     hero -> what you can hire me for -> work -> corporate
     experience -> the unshipped -> the stack.
   About lives on its own page; it is not needed here. */

export default function Home() {
  return (
    <>
      <Hero />
      <Offer />
      <Work />
      <Experience />
      <Unshipped />
      <Pipeline />
    </>
  );
}
