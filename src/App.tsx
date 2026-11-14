import CrawlerField from "./components/CrawlerField";
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Offer from "./sections/Offer";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import CaseStudies from "./sections/CaseStudies";
import Pipeline from "./sections/Pipeline";
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
        <About />
        <Offer />
        <Work />
        <Experience />
        <CaseStudies />
        <Pipeline />
        <Contact />
      </main>
      <Analytics />
    </>
  );
}
