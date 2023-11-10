import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../assets/Icons";
import categoriesConstants from "../../constants/categoriesConstants";
import { useDispatch, useSelector } from "react-redux";
import { displayCart } from "../../app/feature/cart/cartSlice";
import { displayWishList } from "../../app/feature/wishList/wishListSlice";
import axios from "axios";
import server from "../../server";
import toast from "react-hot-toast";
import { useUserAuth } from "../../context/userAuthContext";
import NavComponent from "./NavComponent";
import { setCategoryOptions } from "../../app/feature/search/searchOptionsSlice";
const { heart, cart, profile } = Icons;

const UserNavbar = () => {
	const navigate = useNavigate();
	const userData = useSelector((state) => state.userData.userData);
	const dispatch = useDispatch();
	const { logOut } = useUserAuth();
	const navItems = [
		{ name: "Home", link: "/" },
		{ name: "Best Selling", link: "/best-selling" },
		{ name: "Products", link: "/new-products" },
		{ name: "Events", link: "/events" },
		{ name: "FAQs", link: "/faqs" },
	];

	const categoryChange = (e) => {
		navigate(`/search`);
		dispatch(setCategoryOptions(e.target.value));
	};

	const handleLogOut = async () => {
		try {
			await logOut();
		} catch (err) {
			console.log(err);
		}
		axios
			.get(`${server}/user/logout`, { withCredentials: true })
			.then((res) => {
				toast.success(res.data.message);
				navigate("/");
				window.location.reload();
			});
	};

	return (
		<div className="vw-100">
			<nav className="navbar navbar-expand-lg bg-body-light bg-light">
				<div className="container container-xxl">
					<button
						className="navbar-toggler visually-hidden"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className="collapse navbar-collapse "
						id="navbarSupportedContent">
						<ul className="navbar-nav w-100">
							<li className="nav-item my-3 my-lg-auto">
								<section>
									<label className="visually-hidden " htmlFor="categorySelect">
										Select a Category:
									</label>
									<select
										onChange={categoryChange}
										className="w-75 form-select form-select-sm bg-secondary text-white px-3"
										id="categorySelect">
										<option value="">Select Category</option>
										{categoriesConstants.map((e) => (
											<option key={e.key} value={e.key}>
												{e.value}
											</option>
										))}
									</select>
								</section>
							</li>
							<li className="mx-auto">
								<div className="d-flex justify-content-between p-2">
									<NavComponent navItems={navItems} />
								</div>
							</li>
						</ul>
					</div>
					<section className="ms-auto d-flex gap-3 my-3 my-lg-auto">
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
						</section>
						{userData?.fullName ? (
							<div className="btn-group">
								<button
									onClick={() => navigate(`/user/dashboard`)}
									className="btn btn-secondary btn-sm text-white text-nowrap"
									type="button">
									<span>{profile}</span>
									<span className="mx-1"> {userData.fullName}</span>
								</button>
								<button
									type="button"
									className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split"
									data-bs-toggle="dropdown"
									aria-expanded="false">
									<span className="visually-hidden">Toggle Dropdown</span>
								</button>
								<ul className="dropdown-menu">
									<li onClick={handleLogOut}>
										<Link
											className="dropdown-item text-danger fw-bold"
											href="#">
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
			</nav>
		</div>
	);
};

export default UserNavbar;
