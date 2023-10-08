import React, { useEffect, useState } from "react";
import server from "../../server";
import axios from "axios";

import ProductCartMain from "../../components/ProductCartMain";
import toast from "react-hot-toast";

const ProductsPage = ({ type }) => {
	const [productData, setProductData] = useState([]);
	useEffect(() => {
		axios
			.get(`${server}/products/all-products`)
			.then((res) => {
				setProductData(res.data.products);
			})
			.catch((err) => {
				toast.error("Loading failed");
			});
	}, []);

	return (
		<div className={`d-flex   ${type}`}>
			{productData.map((product) => (
				<ProductCartMain
					key={product._id}
					price={product.price}
					productId={product._id}
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
	type: "flex-wrap",
};

export default ProductsPage;
