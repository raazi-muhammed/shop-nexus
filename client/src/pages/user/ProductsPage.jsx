import React, { useEffect, useState } from "react";
import server from "../../server";
import axios from "axios";

import ProductCartMain from "../../components/ProductCartMain";

const ProductsPage = ({ type }) => {
	const [productData, setProductData] = useState({ data: [] });
	//http://localhost:3000/api/v1/products/all-products

	useEffect(() => {
		console.log("all product axios started to work");
		axios.get(`${server}/products/all-products`).then((data) => {
			console.log("data received");
			console.log(setProductData(data));
		});
	}, []);

	return (
		<div className={`d-flex ${type}`}>
			{productData.data.map((product) => (
				<ProductCartMain
					key={product._id}
					productId={product._id}
					price={product.price}
					rating={product.rating}
					name={product.name}
					sold={product.total_sell}
					shopName={product.shop.name}
					imgUrl={product.image_Url[0].url}
					discount_price={product.discount_price}
				/>
			))}
		</div>
	);
};

ProductsPage.defaultProps = {
	type: "flex-wrap min-vh-100",
};

export default ProductsPage;
