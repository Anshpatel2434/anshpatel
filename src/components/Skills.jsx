import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import AllSkillsImages from "../data/skills-imgs"; // Assuming you have the image data as before

const Skills = () => {
	useEffect(() => {
		AOS.init();
	}, []);

	return (
		<section
			className="min-h-screen py-16 bg-dark-rick text-white flex flex-col justify-center items-center"
			id="skills"
		>
			<h2
				className="text-4xl font-bold mb-10"
				data-aos="fade-up"
				data-aos-duration="800"
			>
				My Skills
			</h2>
			<div className="w-full flex flex-wrap justify-center items-center gap-8 px-5">
				{AllSkillsImages.map(
					({
						id,
						imageSrc,
						imageAlt,
						dataAOS,
						dataAOSDuration,
						dataAOSDelay,
					}) => (
						<div
							key={id}
							className="relative group p-4 rounded-lg bg-[#2a2a2a] shadow-lg transition-transform transform hover:scale-105"
							data-aos={dataAOS}
							data-aos-duration={dataAOSDuration}
							data-aos-delay={dataAOSDelay}
						>
							<div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] lg:w-[100px] lg:h-[100px] flex justify-center items-center p-2">
								<img
									src={imageSrc}
									alt={imageAlt}
									className="w-full h-full object-contain cursor-pointer transition-opacity duration-300 ease-in-out group-hover:opacity-80"
									draggable="false"
								/>
							</div>
							{/* Tooltip on Hover */}
							<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-xs text-white py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
								{imageAlt}
							</div>
						</div>
					)
				)}
			</div>
		</section>
	);
};

export default Skills;
