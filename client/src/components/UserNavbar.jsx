import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../assets/Icons";
const { heart, cart, profile } = Icons;
import NavComponent from "./NavComponent";
import category from "../utils/category";
import { useDispatch, useSelector } from "react-redux";
import { displayCart } from "../app/feature/cart/cartSlice";
import { displayWishList } from "../app/feature/wishList/wishListSlice";

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
