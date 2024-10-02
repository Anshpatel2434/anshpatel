import Button from "./Button";
import ResumeButton from "./ResumeButton";
import Heading from "./Heading";
import SocialMedia from "./SocialMedia";

const Landing = () => {
	return (
		<section
			className="w-full min-h-screen px-4 py-16 relative flex flex-col justify-center items-center text-center mx-auto overflow-hidden bg-rich-black"
			id="home"
		>
			<div className="w-full max-w-4xl">
				<h3 className="text-white text-2xl sm:text-3xl lg:text-4xl">
					Hey! I'm <span className="text-light-beige">Ansh Patel</span>
				</h3>

				<Heading
					textSentence={"I'm a Full Stack Web Developer"}
					additionStyles={"mt-2 sm:mt-4"}
					caveatFont={false}
				/>

				<p className="mt-4 sm:mt-6 lg:mt-8 mb-6 sm:mb-8 text-base sm:text-lg text-white">
					I specialize in building robust and scalable web applications using{" "}
					<span className="text-light-beige">modern technologies</span>. My
					expertise spans both{" "}
					<span className="text-light-beige">
						front-end and back-end development
					</span>
					.
					<br className="hidden sm:inline" />
					I'm passionate about creating efficient, user-friendly solutions.
				</p>

				<div className="flex flex-col sm:flex-row justify-center items-center sm:items-baseline space-y-4 sm:space-y-0 sm:space-x-4">
					<Button
						text="View My Work"
						margin="mt-2 sm:mt-4"
						hyperRef="projects"
					/>
					<ResumeButton text="View Resume" margin="mt-2 sm:mt-4" />
				</div>
			</div>
			<SocialMedia />
		</section>
	);
};

export default Landing;
