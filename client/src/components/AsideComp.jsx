import React, { useState } from "react";
import { Link } from "react-router-dom";

const AsideComp = () => {
	const [currentNav, setCurrentNav] = useState(0);
	const asideItems = [
		{
			name: "All Products",
			link: "/seller/dashboard/65222c2bbe72f43f4e4e845e/all-products",
		},
		{
			name: "New Product",
			link: "/seller/dashboard/65222c2bbe72f43f4e4e845e/new-product",
		},
	];

	return (
		<nav className="d-flex flex-column bg-white p-4 m-3 rounded-4 w-100 gap-1 justify-content-center">
			{asideItems.map((e, i) => (
				<Link key={i} to={e.link}>
					<button
						onClick={(e) => setCurrentNav(i)}
						className={
							currentNav === i
								? "btn btn-sm text-start text-white bg-secondary w-100"
								: "btn btn-sm text-start text-secondary w-100"
						}>
						{e.name}
					</button>
				</Link>
			))}
		</nav>
	);
};

export default AsideComp;
