"use client";

import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { Analytics } from "@vercel/analytics/react";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="app h-auto relative overflow-x-hidden bg-rich-black selection:bg-cyan-500/30 selection:text-white">
      <Navbar />
      <Landing />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
      <Analytics />

      <div className="fixed bottom-6 right-6 z-50">
        <motion.a
          href="#home"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-full bg-navy-light border border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/50 shadow-lg transition-all duration-300"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}

export default App;
