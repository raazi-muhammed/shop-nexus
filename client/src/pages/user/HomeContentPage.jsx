import React from "react";
import BestSellingPage from "./BestSellingPage";
import ProductsPage from "./ProductsPage";

const HomeContentPage = () => {
	return (
		<main className="vw-100">
			<h2 className="text-secondary">Best Selling</h2>
			<BestSellingPage type="overflow-scroll " />
			<h2 className="text-secondary">Products</h2>
			<ProductsPage type="overflow-scroll " />
		</main>
	);
};

export default HomeContentPage;
