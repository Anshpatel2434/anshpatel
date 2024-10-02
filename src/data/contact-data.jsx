import "aos/dist/aos.css";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

const contactData = [
	{
		Icon: MdOutlineEmail,
		title: "Email",
		primary: "anshpatel24.work@gmail.com",
		dataAOS: "fade-right",
	},
	{
		Icon: MdOutlinePhone,
		title: "Phone",
		primary: "+91 7046557755",
		dataAOS: "fade-up",
	},
	{
		Icon: IoLocationOutline,
		title: "Location",
		primary: "Gujarat, India",
		dataAOS: "fade-left",
	},
];

export default contactData;
