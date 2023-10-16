import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../assets/Icons";
const { heart, cart, profile } = Icons;
import NavComponent from "./NavComponent";
import category from "../utils/category";
import { useDispatch, useSelector } from "react-redux";
import { displayCart } from "../app/feature/cart/cartSlice";
import { displayWishList } from "../app/feature/wishList/wishListSlice";
import axios from "axios";
import server from "../server";
import toast from "react-hot-toast";

const UserNavbar = () => {
	const navigate = useNavigate();
	const userData = useSelector((state) => state.userData.userData);
	const dispatch = useDispatch();

	const navItems = [
		{ name: "Home", link: "/" },
		{ name: "Best Selling", link: "/best-selling" },
		{ name: "Products", link: "/new-products" },
		{ name: "Events", link: "/" },
		{ name: "FAQs", link: "/faqs" },
	];

	const handleLogOut = () => {
		axios
			.get(`${server}/user/logout`, { withCredentials: true })
			.then((res) => {
				toast.success(res.data.message);
				navigate("/");
				window.location.reload();
			});
	};

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

						{userData?.fullName ? (
							<div class="btn-group">
								<button
									onClick={() => navigate(`/user/dashboard/${userData._id}`)}
									class="btn btn-secondary btn-sm text-white"
									type="button">
									<span>{profile}</span>
									<span className="mx-1"> {userData.fullName}</span>
								</button>
								<button
									type="button"
									class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split"
									data-bs-toggle="dropdown"
									aria-expanded="false">
									<span class="visually-hidden">Toggle Dropdown</span>
								</button>
								<ul class="dropdown-menu">
									<li>
										<Link class="dropdown-item" href="#">
											Dashboard
										</Link>
									</li>
									<li>
										<Link class="dropdown-item" href="#">
											Orders
										</Link>
									</li>
									<li>
										<hr class="m-1 text-secondary" />
									</li>
									<li onClick={handleLogOut}>
										<Link class="dropdown-item text-danger fw-bold" href="#">
											Logout
										</Link>
									</li>
								</ul>
							</div>
						) : (
							<Link to={`/login`}>
								<button className="btn btn-sm btn-secondary text-white">
									<span>{profile}</span>
									<span className="mx-2">Log In</span>
								</button>
							</Link>
						)}
					</section>
				</div>
			</div>
		</section>
	);
};

export default UserNavbar;
