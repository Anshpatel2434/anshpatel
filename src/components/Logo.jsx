import { Link } from "react-scroll";

const Logo = () => (
	<>
		<Link
			to={"home"}
			spy={true}
			smooth={true}
			offset={-100}
			duration={800}
			delay={100}
			className="py-2 px-1 normal-case font-semibold tracking-wide cursor-pointer"
		>
			<span className="capitalize text-light-beige">a</span>nsh &nbsp;
			<span className="capitalize text-light-beige">p</span>
			<span>atel</span>
		</Link>
	</>
);

export default Logo;
