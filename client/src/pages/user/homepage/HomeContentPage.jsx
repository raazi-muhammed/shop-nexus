import React from "react";
import BestSellingPage from "./BestSellingPage";
import ProductsPage from "./ProductsPage";

const HomeContentPage = () => {
	return (
		<main className="vw-100 min-vh-100 mt-4">
			<div className="w-100 container container-xxl m-0 p-0">
				<h2 className="text-secondary m-0 ms-5 ps-4 pb-0">Best Selling</h2>
				<BestSellingPage />
			</div>
			<div className="w-100 container container-xxl m-0 p-0">
				<h2 className="text-secondary m-0 ms-5 ps-4 pb-0">Products</h2>
				<ProductsPage />
			</div>
		</main>
	);
};

export default HomeContentPage;
