import React from "react";
import BestSellingPage from "./BestSellingPage";
import ProductsPage from "./ProductsPage";

const HomeContentPage = () => {
	return (
		<main className="vw-100 p-4 ">
			<h2 className="text-secondary mt-4 mb-0 ms-4 ">Best Selling</h2>
			<BestSellingPage type="overflow-scroll " />
			<h2 className="text-secondary mt-4 mb-0 ms-4">Products</h2>

			<ProductsPage type="overflow-scroll " />
		</main>
	);
};

export default HomeContentPage;
