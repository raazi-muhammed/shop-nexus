import React from "react";
import UserHeader from "../../components/UserHeader";
import UserNavbar from "../../components/UserNavbar";
import { Route, Routes } from "react-router-dom";
import FAQsPage from "./FAQsPage";
import ProductsPage from "./ProductsPage";

const HomePage = () => {
	return (
		<div>
			<UserHeader />
			<UserNavbar />
			<Routes>
				<Route path="/new-products" element={<ProductsPage />} />
				<Route path="/faqs" element={<FAQsPage />} />
			</Routes>
		</div>
	);
};

export default HomePage;
