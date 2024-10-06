import React from "react";

const ResumeButton = ({ text, margin = "", additionStyle = "" }) => (
	<a
		href="https://drive.google.com/file/d/1E2O5ECE7cilU2HuFB14CSVk55PIMDx_I/view?usp=drive_link"
		target="_blank"
		rel="noopener noreferrer"
		className={`py-[0.66rem] px-12 ${margin} rounded-lg text-[0.98rem] lg:text-lg text-white bg-dark-beige transition hover:bg-[#7d674c] ${additionStyle}`}
	>
		{text}
	</a>
);

export default ResumeButton;
