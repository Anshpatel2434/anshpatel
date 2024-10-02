// Importing the updated icons
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { BsTwitter, BsInstagram } from "react-icons/bs";

import insert from "./generateIDs";

const socialMediaIcons = [
	{
		icon: <FaFacebookF />,
		urlIcon: "https://www.facebook.com/profile.php?id=100010421793589",
		titleIcon: "Facebook",
	},
	{
		icon: <BsTwitter />,
		urlIcon: "https://x.com/AnshPatel2434",
		titleIcon: "Twitter",
	},
	{
		icon: <BsInstagram />,
		urlIcon: "https://www.instagram.com/anshpatel_2434",
		titleIcon: "Instagram",
	},
	{
		icon: <FaLinkedinIn />,
		urlIcon: "https://www.linkedin.com/in/anshpatel2434",
		titleIcon: "LinkedIn",
	},
	{
		icon: <FaGithub />,
		urlIcon: "https://github.com/Anshpatel2434",
		titleIcon: "GitHub",
	},
];

(() => insert(socialMediaIcons))();

export default socialMediaIcons;
