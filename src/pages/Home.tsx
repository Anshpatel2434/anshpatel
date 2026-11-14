import Hero from "../sections/Hero";
import Offer from "../sections/Offer";
import Work from "../sections/Work";
import Experience from "../sections/Experience";
import Unshipped from "../sections/Unshipped";
import Pipeline from "../sections/Pipeline";

/* The homepage, in the order agreed:
     hero -> what you can hire me for -> work -> the ones that
     never shipped -> corporate experience -> the stack.

   The unshipped sit directly under the work on purpose: same
   hands, same two halves, and the only difference is a live link.
   About lives on its own page; it is not needed here. */

export default function Home() {
  return (
    <>
      <Hero />
      <Offer />
      <Work />
      <Unshipped />
      <Experience />
      <Pipeline />
    </>
  );
}
