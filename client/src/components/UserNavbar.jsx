import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../assets/Icons";
const { heart, cart, profile } = Icons;

import NavComponent from "./NavComponent";
import axios from "axios";
import server from "../server";
import toast from "react-hot-toast";

const UserNavbar = () => {
	const navItems = [
		{ name: "Home", link: "/" },
		{ name: "Best Selling", link: "/best-selling" },
		{ name: "Products", link: "/new-products" },
		{ name: "Events", link: "/" },
		{ name: "FAQs", link: "/faqs" },
	];
	const [userData, setUserData] = useState("Log In");

	useEffect(() => {
		axios
			.get(`${server}/user/load-user`, { withCredentials: true })
			.then((res) => {
				if (res.data.success === false) {
					toast.error("You are Blocked");
				} else {
					toast.success("Logged In");
					setUserData(res.data.user);
				}
			})
			.catch((err) => {
				console.log(err.response.data.message);
			});
	}, []);

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
				{/* <Link to="/login"> */}
				<Link to={userData._id ? `/user/profile/${userData._id} ` : `/login`}>
					<button className="btn btn-sm btn-secondary text-white">
						{profile} {userData?.fullName ? `${userData.fullName} ` : `Log In`}
					</button>
				</Link>
			</section>
		</section>
	);
};

export default UserNavbar;
