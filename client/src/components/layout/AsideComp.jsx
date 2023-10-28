import React, { useState } from "react";
import { Link } from "react-router-dom";

const AsideComp = ({ asideItems }) => {
	const [currentNav, setCurrentNav] = useState(0);

	return (
		<nav className="d-flex flex-column bg-white p-4 rounded-4 w-100 gap-1 justify-content-center">
			{asideItems.map((e, i) => (
				<Link key={i} to={e.link}>
					<button
						onClick={(e) => setCurrentNav(i)}
						className={`btn btn-sm text-start w-100 
						${currentNav === i ? "text-white bg-secondary" : "text-secondary"}`}>
						{e.name}
					</button>
				</Link>
			))}
		</nav>
	);
};

export default AsideComp;
