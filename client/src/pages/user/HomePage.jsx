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

const HomePage = () => {
	const [user, setUser] = useState({ id: "test", name: "Guest" });
	return (
		<div>
			<UserHeader />
			<UserNavbar user={user} />
			<Routes>
				<Route path="/new-products" element={<ProductsPage />} />
				<Route path="/best-selling" element={<BestSellingPage />} />
				<Route path="/faqs" element={<FAQsPage />} />
				<Route path="/product/:id" element={<SingleProductPage />} />
				<Route path="/" element={<HomeContentPage />} />
			</Routes>
			<FooterComp />
		</div>
	);
};

export default HomePage;
