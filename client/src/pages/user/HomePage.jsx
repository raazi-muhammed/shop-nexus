import React from "react";
import UserHeader from "../../components/UserHeader";
import UserNavbar from "../../components/UserNavbar";
import { Route, Routes } from "react-router-dom";
import FAQsPage from "./FAQsPage";
import ProductsPage from "./ProductsPage";
import BestSellingPage from "./BestSellingPage";
import HomeContentPage from "./HomeContentPage";
import Footer from "../../components/Footer";

const HomePage = () => {
	return (
		<div>
			<UserHeader />
			<UserNavbar />

			<div className="min-vh-100">
				<Routes>
					<Route path="/new-products" element={<ProductsPage />} />
					<Route path="/best-selling" element={<BestSellingPage />} />
					<Route path="/faqs" element={<FAQsPage />} />
					<Route path="/" element={<HomeContentPage />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
};

export default HomePage;
