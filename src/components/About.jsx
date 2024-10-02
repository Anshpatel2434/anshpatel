import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import AOS from "aos";
import "aos/dist/aos.css";
import { MyPic } from "../data/imgs-imports";
import Button from "./Button";

const About = () => {
	useEffect(() => {
		AOS.init({
			duration: 600,
		});
	}, []);

	return (
		<section
			id="about"
			className="w-screen py-40 relative bg-[#222] flex justify-center items-center"
		>
			<div className="container grid place-content-center grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-0 items-start">
				<div
					className="w-full h-full px-4 text-center lg:text-start relative flex flex-col justify-center"
					data-aos="fade-right"
				>
					<h4 className="text-white text-5xl font-[Caveat]">Ansh Patel</h4>

					<p className="mt-2 mb-6 text-light-beige text-center lg:text-start text-3xl capitalize font-[Caveat]">
						Full Stack Web Developer
					</p>

					<p className="text-white text-lg leading-7">
						As a passionate Full Stack Web Developer, I bring ideas to life
						through code. With expertise in both front-end and back-end
						technologies, I create seamless, responsive, and efficient web
						applications. My focus is on delivering high-quality solutions that
						meet modern web standards and exceed client expectations. I'm
						constantly learning and adapting to new technologies to stay at the
						forefront of web development.
					</p>

					<div className="w-full mx-auto flex justify-center lg:justify-start items-center">
						<Button
							hyperRef={"contact"}
							text={"Get In Touch"}
							margin={"mt-8"}
						/>
					</div>
				</div>

				<div
					className="w-[50%] sm:w-[55%] lg:w-[60%] mx-auto rounded-full flex justify-center items-center"
					data-aos="fade-left"
				>
					<LazyLoadImage
						effect="blur"
						threshold={70}
						src={MyPic}
						alt="Ansh Patel"
						className="w-full rounded-full object-cover"
						draggable="false"
					/>
				</div>
			</div>
		</section>
	);
};

export default About;
