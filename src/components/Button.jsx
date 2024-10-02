import React from "react";

const Button = ({ text, margin = "", hyperRef = "", additionStyle = "" }) => {
	const handleClick = (e) => {
		e.preventDefault();
		const element = document.getElementById(hyperRef);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<a
			href={`${hyperRef}`}
			onClick={handleClick}
			className={`py-[0.66rem] px-12 ${margin} rounded-lg text-[0.98rem] lg:text-lg text-white bg-dark-beige transition hover:bg-[#7d674c] ${additionStyle}`}
		>
			{text}
		</a>
	);
};

export default Button;
