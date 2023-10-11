import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../assets/Icons";
const { heart, cart, profile } = Icons;

import NavComponent from "./NavComponent";
import axios from "axios";
import server from "../server";
import toast from "react-hot-toast";
import CartUser from "./CartUser";
import WishListUser from "./WishListUser";
import category from "../utils/category";

const UserNavbar = () => {
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isWishListOpen, setIsWishListOpen] = useState(false);
	const navItems = [
		{ name: "Home", link: "/" },
		{ name: "Best Selling", link: "/best-selling" },
		{ name: "Products", link: "/new-products" },
		{ name: "Events", link: "/" },
		{ name: "FAQs", link: "/faqs" },
	];
	const [userData, setUserData] = useState("Log In");
	/* useEffect(() => {
		axios
			.get(
				`http://localhost:3000/auth/login/success`,
				{ withCredentials: true },
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"Access-Control-Allow-Credentials": true,
					},
				}
			)
			.then((res) => {
				console.log(res);
				setUserData({ fullName: res.data.user.displayName });
			})
			.catch((err) => console.log(err));
	}, []); */

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
				<label className="visually-hidden " for="categorySelect">
					Select a Category:
				</label>
				<select
					className="w-75 form-select form-select-sm bg-secondary text-white px-3"
					id="categorySelect">
					<option value="">Select Category</option>
					{category.map((e) => (
						<option value={e}>{e}</option>
					))}
				</select>
			</div>
			<NavComponent navItems={navItems} />
			<section className="d-flex gap-3">
				<button
					onClick={() => setIsWishListOpen(true)}
					className="btn btn-sm btn-secondary text-white">
					{heart}
				</button>
				<button
					onClick={() => setIsCartOpen(true)}
					className="btn btn-sm btn-secondary text-white">
					{cart}
				</button>
				{/* <Link to="/login"> */}
				<Link to={userData._id ? `/user/dashboard/${userData._id} ` : `/login`}>
					<button className="btn btn-sm btn-secondary text-white">
						{profile} {userData?.fullName ? `${userData.fullName} ` : `Log In`}
					</button>
				</Link>
			</section>
			{isCartOpen ? (
				<aside className="bg-white aside-card overflow-auto ">
					<button
						onClick={() => setIsCartOpen(false)}
						className="btn btn-sm text-primary w-100">
						Close
					</button>
					<CartUser />
				</aside>
			) : null}
			{isWishListOpen ? (
				<aside className="bg-white aside-card overflow-auto ">
					<button
						onClick={() => setIsWishListOpen(false)}
						className="btn btn-sm text-primary w-100">
						Close
					</button>
					<WishListUser />
				</aside>
			) : null}
		</section>
	);
};

export default UserNavbar;
