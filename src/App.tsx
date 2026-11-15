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
import { useSmoothScroll, useReveals, scrollPageTo } from "./lib/motion";
import { Analytics } from "@vercel/analytics/react";

/* A route change should land at the top of the new page, not
   wherever the previous one happened to be scrolled to. */
/* Opening a page puts you at the start of it. Arriving halfway down
   a document you have never seen is disorienting, and the browser's
   own restoration is for going back, not for following a link.

   The exception is a link that named a section — #stack, #experience
   — which is a request for that part of the page, not the top of it. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      /* The page is still growing when the route changes — webfonts
         and images are not in yet — so a scroll issued now gets
         clamped to whatever the height happens to be. Wait until the
         section is actually reachable, then go. */
      let id = 0;
      let tries = 0;
      const go = () => {
        const el = document.querySelector<HTMLElement>(hash);
        if (!el) return;
        const target = el.getBoundingClientRect().top + window.scrollY;
        const reach = document.documentElement.scrollHeight - window.innerHeight;
        if (target > reach + 4 && tries++ < 20) {
          id = window.setTimeout(go, 70);
          return;
        }
        scrollPageTo(el);
      };
      id = window.setTimeout(go, 300);
      return () => window.clearTimeout(id);
    }
    scrollPageTo(0, false);
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
