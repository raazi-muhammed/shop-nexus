import React from "react";
import BestSellingPage from "./BestSellingPage";
import ProductsPage from "./ProductsPage";

const HomeContentPage = () => {
	return (
		<main className="vw-100 min-vh-100 p-24 mt-4">
			<div className="w-100 container container-xxl  ">
				<h2 className="text-secondary ms-3">Best Selling</h2>
				<BestSellingPage type="overflow-scroll " />
			</div>
			<div className="w-100 container container-xxl  ">
				<h2 className="text-secondary  ms-3">Products</h2>
				<ProductsPage type="overflow-scroll " />
			</div>
		</main>
	);
};

export default HomeContentPage;
