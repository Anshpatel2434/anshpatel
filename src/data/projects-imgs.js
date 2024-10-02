import insert from "./generateIDs";

import {
	ImageProject1,
	ImageProject2,
	ImageProject3,
	ImageProject4,
} from "./imgs-imports";

const projectsImages = [
	{
		imageSrc: ImageProject1,
		imageAlt: "Uni-Ask",
		projectCategory: "Academic Platform",
		projectDescription:
			"This academic platform was developed to provide personalized solutions and foster collaborative learning. Built with Django for the backend, WebSockets powered by Django Channels for real-time interactions, and React for the frontend, the application offers seamless doubt-clearing, peer-to-peer discussions, and progress tracking. It features dynamic chat rooms, leaderboards, and analytics-driven learning insights, creating an engaging environment for students.",
		githubLink: "https://github.com/Anshpatel2434/UniAsk",
		deploymentLink: "https://uni-ask.vercel.app",
		dataAOS: "zoom-in",
		dataAOSDuration: "800",
		dataAOSDelay: "150",
	},
	{
		imageSrc: ImageProject2,
		imageAlt: "E-commerce",
		projectCategory: "E-commerce App",
		projectDescription:
			"This e-commerce application was developed to offer a seamless shopping experience without transaction processing. Utilizing React for the front-end, Prisma ORM for database management, and Hono for serverless APIs, the app features intuitive navigation, real-time inventory management, and personalized recommendations. The project aimed to enhance user experience, build a scalable solution, and leverage the latest web technologies.",
		githubLink: "https://github.com/Anshpatel2434/Ecommerce-app",
		deploymentLink: "https://ecommerce-app-nu-beryl.vercel.app",
		dataAOS: "zoom-in",
		dataAOSDuration: "800",
		dataAOSDelay: "150",
	},
	{
		imageSrc: ImageProject3,
		imageAlt: "Study-Share",
		projectCategory: "Study Share",
		projectDescription:
			"StudyShare is an innovative E-library platform designed to revolutionize the digital reading and learning experience. Our platform aims to create a vibrant community of readers and learners, providing a seamless environment for accessing, sharing, and discussing educational materials.",
		githubLink: "https://github.com/Anshpatel2434/Tic-Tech-Toe-24",
		deploymentLink: "/",
		dataAOS: "zoom-in",
		dataAOSDuration: "800",
		dataAOSDelay: "150",
	},
];

(() => insert(projectsImages))();

export default projectsImages;
