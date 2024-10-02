/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"rich-black": "rgb(10 9 8)", // Defining the custom color here
				"light-beige": "rgb(169 146 125)",
				"dark-beige": "rgb(94 80 63)",
			},
			fontFamily: {
				caveat: ['"Caveat"', "cursive"], // Add Caveat font family
			},
		},
	},
	plugins: [],
};
