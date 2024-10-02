import React, { useEffect } from "react";
import AOS from "aos";
import Heading from "./Heading";
import ContactInfo from "./ContactInfo";
import contactData from "../data/contact-data";

const Contact = () => {
	useEffect(() => {
		AOS.init();
	}, []);

	return (
		<section id="contact" className="py-40 px-2 md:px-8 bg-[#1a1a1a]">
			<div className="container mx-auto">
				<Heading textSentence="Contact Me" additionStyles="mb-6" />

				<p className="w-[90%] lg:w-[70%] mb-16 mx-auto text-white text-sm lg:text-lg leading-6">
					Feel free to reach out to me through any of the following channels.
					I'm always excited to connect and discuss new opportunities.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
					{contactData.map((item, index) => (
						<ContactInfo key={index} {...item} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Contact;
