import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AllProjectsImages from "../data/projects-imgs.js";
import Heading from "./Heading.jsx";

const Projects = () => {
	const [visibleProjects, setVisibleProjects] = useState(3);

	useEffect(() => {
		AOS.init();
	}, []);

	const loadMoreProjects = () => {
		setVisibleProjects((prevCount) => prevCount + 3);
	};

	return (
		<section id="projects">
			<div className="container py-36 px-8 text-center bg-[#1a1a1a]">
				<Heading textSentence={"my last work"} />

				<p className="w-[90%] lg:w-[80%] mt-6 mx-auto text-white text-sm lg:text-lg leading-6">
					Here are some of the projects I've worked on recently. Each project
					showcases different skills and technologies I've mastered.
				</p>

				<div className="w-full mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-8">
					{AllProjectsImages.slice(0, visibleProjects).map(
						({
							id,
							imageSrc,
							imageAlt,
							projectCategory,
							projectDescription,
							githubLink,
							dataAOS,
							dataAOSDelay,
							dataAOSDuration,
						}) => (
							<div
								key={id}
								data-aos={dataAOS}
								data-aos-easing="linear"
								data-aos-duration={dataAOSDuration}
								data-aos-delay={dataAOSDelay}
								className="w-full"
							>
								<div className="relative group">
									<div className="w-full h-[320px] rounded-3xl overflow-hidden transition-all duration-[0.9s]">
										<img
											src={imageSrc}
											alt={imageAlt}
											draggable="false"
											className="w-full h-full object-cover transition-all duration-[0.9s] group-hover:scale-110 group-hover:-rotate-[5deg]"
										/>
									</div>
									<div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl">
										<p className="text-white text-sm px-4 mb-4">
											{projectDescription}
										</p>
										<a
											href={githubLink}
											target="_blank"
											rel="noopener noreferrer"
											className="px-4 py-2 bg-light-beige text-rich-black font-semibold rounded-full hover:bg-dark-beige transition-colors duration-300"
										>
											View Github
										</a>
									</div>
								</div>
								<p className="mt-6 text-xl text-light-beige">
									{projectCategory}
								</p>
							</div>
						)
					)}
				</div>

				{visibleProjects < AllProjectsImages.length && (
					<button
						onClick={loadMoreProjects}
						className="mt-16 px-6 py-3 bg-light-beige text-rich-black font-semibold rounded-full hover:bg-dark-beige transition-colors duration-300"
					>
						Show More Projects
					</button>
				)}
			</div>
		</section>
	);
};

export default Projects;
