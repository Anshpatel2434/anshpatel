import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import GoToTop from "./components/GoToTop";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { Analytics } from "@vercel/analytics/react";

function App() {
	return (
		<div className="app h-auto relative overflow-x-hidden bg-rich-black selection:text-rich-black selection:bg-light-beige">
			<GoToTop />
			<Navbar />
			<Landing />
			<About />
			<Skills />
			<Projects />
			<Experience />
			<Contact />
			<Footer />
			<Analytics />
		</div>
	);
}

export default App;
