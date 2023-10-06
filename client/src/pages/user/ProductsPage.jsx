import React, { useEffect, useState } from "react";
import server from "../../server";
import axios from "axios";

import ProductCartMain from "../../components/ProductCartMain";

const ProductsPage = () => {
	const [productData, setProductData] = useState({ data: [] });
	//http://localhost:3000/api/v1/products/all-products

	useEffect(() => {
		console.log("all product axios started to work");
		axios.get(`${server}/products/all-products`).then((data) => {
			console.log("data receved");
			console.log(setProductData(data));
		});
	}, []);

	return (
		<div className="d-flex flex-wrap">
			{productData.data.map((product) => (
				<ProductCartMain
					key={product._id}
					price={product.price}
					rating={product.rating}
					name={product.name}
					stock={product.stock}
					shopName={product.shop.name}
					imgUrl={product.image_Url[0].url}
					discount_price={product.discount_price}
				/>
			))}
		</div>
	);
};

export default ProductsPage;
