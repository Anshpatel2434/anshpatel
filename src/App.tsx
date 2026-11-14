import CrawlerField from "./components/CrawlerField";
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Offer from "./sections/Offer";
import Pipeline from "./sections/Pipeline";
import Work from "./sections/Work";
import Career from "./sections/Career";
import Contact from "./sections/Contact";
import { useSmoothScroll, useReveals } from "./lib/motion";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  useSmoothScroll();
  useReveals();

  return (
    <>
      <CrawlerField />
      <Nav />
      <main>
        <Hero />
        <Offer />
        <Pipeline />
        <Work />
        <Career />
        <Contact />
      </main>
      <Analytics />
    </>
  );
}
