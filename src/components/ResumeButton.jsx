import React from "react";

const ResumeButton = ({ text, margin = "", additionStyle = "" }) => (
	<a
		href="https://drive.google.com/file/d/1u3YP4zWfDgH78WQsUA46dkBc5ivrSmP8/view?usp=sharing"
		target="_blank"
		rel="noopener noreferrer"
		className={`py-[0.66rem] px-12 ${margin} rounded-lg text-[0.98rem] lg:text-lg text-white bg-dark-beige transition hover:bg-[#7d674c] ${additionStyle}`}
	>
		{text}
	</a>
);

export default ResumeButton;
