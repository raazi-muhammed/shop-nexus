import React, { useState } from "react";
import UserHeader from "../../components/UserHeader";
import UserNavbar from "../../components/UserNavbar";
import { Route, Routes } from "react-router-dom";
import FAQsPage from "./FAQsPage";
import ProductsPage from "./ProductsPage";
import BestSellingPage from "./BestSellingPage";
import HomeContentPage from "./HomeContentPage";
import SingleProductPage from "./SingleProductPage";
import FooterComp from "../../components/FooterComp";
import UserDashboard from "./UserDashboard";
import UserSingleShopPage from "./UserSingleShopPage";

const HomePage = () => {
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
				<Route path="/" element={<HomeContentPage />} />
			</Routes>

			<FooterComp />
		</div>
	);
};

export default HomePage;
