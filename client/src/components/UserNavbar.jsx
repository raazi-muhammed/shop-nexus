import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../assets/Icons";
const { heart, cart, profile } = Icons;

import NavComponent from "./NavComponent";
import axios from "axios";
import server from "../server";
import toast from "react-hot-toast";
import category from "../utils/category";
import { useDispatch, useSelector } from "react-redux";
import { displayCart, hideCart } from "../app/feature/cart/cartSlice";
import { displayWishList } from "../app/feature/wishList/wishListSlice";
import { setUserDataReducer } from "../app/feature/userData/userDataSlice";

const UserNavbar = () => {
	const userData = useSelector((state) => state.userData.userData);
	const dispatch = useDispatch();

	const navItems = [
		{ name: "Home", link: "/" },
		{ name: "Best Selling", link: "/best-selling" },
		{ name: "Products", link: "/new-products" },
		{ name: "Events", link: "/" },
		{ name: "FAQs", link: "/faqs" },
	];

	//const [userData, setUserData] = useState("Log In");

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

	/* useEffect(() => {
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
	}, []); */

	return (
		<section className="w-100 bg-light">
			<div className="container container-xl">
				<div className="d-flex justify-content-between p-2">
					<section>
						<label className="visually-hidden " htmlFor="categorySelect">
							Select a Category:
						</label>
						<select
							className="w-75 form-select form-select-sm bg-secondary text-white px-3"
							id="categorySelect">
							<option value="">Select Category</option>
							{category.map((e) => (
								<option key={e} value={e}>
									{e}
								</option>
							))}
						</select>
					</section>
					<NavComponent navItems={navItems} />
					<section className="d-flex gap-3">
						<button
							onClick={() => dispatch(displayWishList())}
							className="btn btn-sm btn-secondary text-white">
							{heart}
						</button>
						<button
							onClick={() => dispatch(displayCart())}
							className="btn btn-sm btn-secondary text-white">
							{cart}
						</button>
						<Link
							to={
								userData?._id ? `/user/dashboard/${userData._id} ` : `/login`
							}>
							<button className="btn btn-sm btn-secondary text-white">
								{profile}{" "}
								{userData?.fullName ? `${userData.fullName} ` : `Log In`}
							</button>
						</Link>
					</section>
				</div>
			</div>
		</section>
	);
};

export default UserNavbar;
