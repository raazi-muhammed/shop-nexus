import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavComponent = ({ navItems }) => {
	const [currentNav, setCurrentNav] = useState(0);
	return (
		<nav className="d-flex gap-3">
			{navItems.map((e, i) => (
				<Link to={e.link}>
					<button
						onClick={(e) => setCurrentNav(i)}
						className={
							currentNav === i
								? "btn btn-sm text-white bg-secondary"
								: "btn btn-sm text-secondary"
						}>
						{e.name}
					</button>
				</Link>
			))}
		</nav>
	);
};

export default NavComponent;
