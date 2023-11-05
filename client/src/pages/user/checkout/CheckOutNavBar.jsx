import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CheckOutNavBar = ({ currentNav, setCurrentNav }) => {
	const location = useLocation();
	const navItems = [
		{ name: "Shipping", link: "" },
		{ name: "Payment", link: "payment" },
		{ name: "Success", link: "success" },
	];
	useEffect(() => {
		navItems.map((e, i) => {
			if (location.pathname.endsWith(e.link)) setCurrentNav(i);
		});
	}, [location.pathname]);
	return (
		<nav className="d-flex justify-content-center mb-4">
			{navItems.map((e, i) => (
				<div className="d-flex align-items-center">
					{i !== 0 && (
						<div
							className={currentNav >= i ? "bg-primary" : "bg-light"}
							style={{ width: "3rem", height: "5px" }}></div>
					)}
					<button
						className={
							currentNav >= i
								? "btn btn-sm px-3 text-white bg-primary"
								: "btn btn-sm px-3 text-secondary bg-light"
						}>
						{e.name}
					</button>
				</div>
			))}
		</nav>
	);
};

export default CheckOutNavBar;
