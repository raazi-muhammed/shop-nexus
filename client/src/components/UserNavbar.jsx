import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../assets/Icons";
import NavComponent from "./NavComponent";

const { heart, cart, profile } = Icons;
const UserNavbar = ({ user }) => {
	const navItems = [
		{ name: "Home", link: "/" },
		{ name: "Best Selling", link: "/best-selling" },
		{ name: "Products", link: "/new-products" },
		{ name: "Events", link: "/" },
		{ name: "FAQs", link: "/faqs" },
	];
	return (
		<section className="d-flex justify-content-between p-2 bg-light">
			<div>
				<button className="btn btn-sm btn-secondary text-white">
					Catergories
				</button>
			</div>
			<NavComponent navItems={navItems} />
			<section className="d-flex gap-3">
				<button className="btn btn-sm btn-secondary text-white">{heart}</button>
				<button className="btn btn-sm btn-secondary text-white">{cart}</button>
				<Link to="/login">
					<button className="btn btn-sm btn-secondary text-white">
						{profile} {user.name}
					</button>
				</Link>
			</section>
		</section>
	);
};

export default UserNavbar;
