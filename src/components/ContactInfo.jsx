import { useState } from "react";

const ContactInfo = ({ Icon, title, primary, dataAOS }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(primary).then(() => {
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
		});
	};

	return (
		<div
			className="bg-dark-beige rounded-lg p-6 flex items-start space-x-4 transition-all duration-300 hover:shadow-lg hover:bg-light-beige cursor-pointer"
			data-aos={dataAOS}
			data-aos-duration="1000"
			onClick={handleCopyToClipboard} // Add onClick event
		>
			<Icon className="text-4xl text-white flex-shrink-0" />
			<div>
				<h3 className="text-xl font-bold text-white">{title}</h3>
				<p className="text-gray-200 mt-1">{primary}</p>
				{isCopied && (
					<span className="text-sm text-green-400 mt-1">
						Copied to clipboard!
					</span>
				)}
			</div>
		</div>
	);
};

export default ContactInfo;
