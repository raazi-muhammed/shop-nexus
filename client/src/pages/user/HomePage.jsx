import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import FAQsPage from "./homepage/FAQsPage";
import ProductsPage from "./homepage/ProductsPage";
import BestSellingPage from "./homepage/BestSellingPage";
import HomeContentPage from "./homepage/HomeContentPage";
import SingleProductPage from "./SingleProductPage";
import UserDashboard from "./UserDashboard";
import UserSingleShopPage from "./UserSingleShopPage";

import { useDispatch, useSelector } from "react-redux";
import server from "../../server";
import axios from "axios";

import { setUserDataReducer } from "../../app/feature/userData/userDataSlice";
import toast from "react-hot-toast";
import CheckOutPage from "./CheckOutPage";
import UserHeader from "../../components/layout/UserHeader";
import UserNavbar from "../../components/layout/UserNavbar";
import CartUser from "../../components/user/CartUser";
import WishListUser from "../../components/user/WishListUser";
import FooterComp from "../../components/layout/FooterComp";

const HomePage = () => {
	const cartState = useSelector((state) => state.cart.isCartVisible);
	const wishListState = useSelector(
		(state) => state.wishList.isWishListVisible
	);
	const dispatch = useDispatch();

	useEffect(() => {
		axios
			.get(`${server}/user/load-user`, { withCredentials: true })
			.then((res) => {
				if (res.data.success === false) {
					toast.error("You are Blocked");
				} else {
					toast.success("Logged In");
					dispatch(setUserDataReducer(res.data.user));
				}
			})
			.catch((err) => {
				console.log(err.response.data.message);
			});
	}, []);

	return (
		<div>
			<UserHeader />
			<UserNavbar />

			<Routes>
				<Route path="/new-products" element={<ProductsPage />} />
				<Route path="/best-selling" element={<BestSellingPage />} />
				<Route path="/faqs" element={<FAQsPage />} />
				<Route path="/product/:id/*" element={<SingleProductPage />} />
				<Route path="/shop/:id/*" element={<UserSingleShopPage />} />
				<Route path="/user/dashboard/:userId/*" element={<UserDashboard />} />
				<Route path="/user/checkout/*" element={<CheckOutPage />} />
				<Route path="/" element={<HomeContentPage />} />
			</Routes>

			{cartState ? (
				<aside className="bg-white aside-card overflow-auto ">
					<CartUser />
				</aside>
			) : null}

			{wishListState ? (
				<aside className="bg-white aside-card overflow-auto ">
					<WishListUser />
				</aside>
			) : null}

			<FooterComp />
		</div>
	);
};

export default HomePage;
