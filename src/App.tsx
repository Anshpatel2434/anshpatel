import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import CrawlerField from "./components/CrawlerField";
import PaletteSwitch from "./components/PaletteSwitch";
import Nav from "./components/Nav";
import Contact from "./sections/Contact";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import WorkPage from "./pages/WorkPage";
import ProjectPage from "./pages/ProjectPage";
import { useSmoothScroll, useReveals } from "./lib/motion";
import { Analytics } from "@vercel/analytics/react";

/* A route change should land at the top of the new page, not
   wherever the previous one happened to be scrolled to. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return () => window.clearTimeout(id);
    }
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
          <Route path="/project/:slug" element={<ProjectPage />} />
          <Route path="/case-studies" element={<Navigate to="/work" replace />} />
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
