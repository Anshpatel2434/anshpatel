import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AllExperienceInfo from "../data/experience-info.jsx";
import Heading from "./Heading.jsx";
import { Code, Briefcase, Rocket } from "lucide-react";

const iconMap = {
	1: Code,
	2: Briefcase,
	3: Rocket,
};

const Experience = () => {
	useEffect(() => {
		AOS.init();
	}, []);

	return (
		<section id="experience" className="py-40 px-2 md:px-8 bg-rich-black">
			<div className="container mx-auto">
				{/* Heading */}
				<Heading textSentence={"My Experience"} additionStyles={"mb-6"} />

				{/* Description */}
				<p className="w-[90%] lg:w-[70%] mb-16 mx-auto text-white text-sm lg:text-lg leading-6">
					Here's a timeline of my professional journey in web development.
				</p>

				{/* Experience Timeline */}
				<div className="timeline mt-16">
					{AllExperienceInfo.map((exp, index) => {
						const IconComponent = iconMap[exp.id] || Code;
						return (
							<div
								key={exp.id}
								className={`timeline-item ${
									index % 2 === 0 ? "left" : "right"
								}`}
								data-aos={exp.dataAOS}
								data-aos-duration={exp.dataAOSDuration}
								data-aos-delay={exp.delay}
							>
								<div className="date text-light-beige">{exp.duration}</div>
								<div
									className={`content ${
										index % 2 === 0 ? "bg-dark-beige" : "bg-dark-beige"
									} text-white rounded-lg p-6`}
								>
									<h3 className="text-xl font-bold text-white">{exp.role}</h3>
									<h4 className="text-lg font-medium text-gray-200 mt-2">
										{exp.company}
									</h4>
									<p className="text-gray-300 mt-2">{exp.description}</p>
								</div>
								<div className="icon-container">
									<IconComponent size={24} className="icon" />
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default Experience;
