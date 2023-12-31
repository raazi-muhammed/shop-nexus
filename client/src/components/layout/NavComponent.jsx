import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavComponent = ({ navItems }) => {
	const [currentNav, setCurrentNav] = useState(0);

	return (
		<nav className="d-flex gap-3 justify-content-center">
			{navItems.map((e, i) => (
				<Link key={i} to={e.link}>
					<button
						onClick={(e) => setCurrentNav(i)}
						className={
							currentNav === i
								? "text-nowrap btn btn-sm text-white bg-secondary"
								: "text-nowrap btn btn-sm text-secondary"
						}>
						{e.name}
					</button>
				</Link>
			))}
		</nav>
	);
};

export default NavComponent;
