import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CrawlerField from "./components/CrawlerField";
import PaletteSwitch from "./components/PaletteSwitch";
import Nav from "./components/Nav";
import Contact from "./sections/Contact";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import WorkPage from "./pages/WorkPage";
import ExperiencePage from "./pages/ExperiencePage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import StackPage from "./pages/StackPage";
import { useSmoothScroll, useReveals } from "./lib/motion";
import { Analytics } from "@vercel/analytics/react";

/* A route change should land at the top of the new page, not
   wherever the previous one happened to be scrolled to. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function Shell() {
  const { pathname } = useLocation();
  useSmoothScroll();
  useReveals(pathname);

  return (
    <>
      <CrawlerField />
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Contact />
      </main>
      {import.meta.env.DEV && <PaletteSwitch />}
      <Analytics />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
