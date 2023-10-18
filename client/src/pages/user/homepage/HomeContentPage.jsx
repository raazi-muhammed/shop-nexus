import React from "react";
import BestSellingPage from "./BestSellingPage";
import ProductsPage from "./ProductsPage";

const HomeContentPage = () => {
	return (
		<>
			<BestSellingPage showHeading={true} />
			<ProductsPage showHeading={true} />
		</>
	);
};

export default HomeContentPage;
