import React from "react";
import BestSellingPage from "./BestSellingPage";
import ProductsPage from "./ProductsPage";
import EventsPage from "./EventsPage";

const HomeContentPage = () => {
	return (
		<>
			<EventsPage onHomePage={true} />
			<BestSellingPage showHeading={true} overFlow={true} />
			<ProductsPage showHeading={true} overFlow={true} />
		</>
	);
};

export default HomeContentPage;
