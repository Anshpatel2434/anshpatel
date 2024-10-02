import insert from "./generateIDs";

const navbarItems = [
	{ linkText: "home", linkTo: "home" },
	{ linkText: "about", linkTo: "about" },
	{ linkText: "skills", linkTo: "skills" },
	{ linkText: "projects", linkTo: "projects" },
	{ linkText: "experience", linkTo: "experience" },
	{ linkText: "contact", linkTo: "contact" },
];

(() => insert(navbarItems))();

export default navbarItems;
