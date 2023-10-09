import React, { useEffect, useState } from "react";
import server from "../../server";
import axios from "axios";
import ProductCartMain from "../../components/ProductCartMain";

const BestSellingPage = ({ type }) => {
	const [productData, setProductData] = useState([]);

	useEffect(() => {
		axios.get(`${server}/products/best-selling`).then((res) => {
			setProductData(res.data.products);
		});
	}, []);

	return (
		<div className={`d-flex  ${type}`}>
			{productData.map((product) => (
				<ProductCartMain
					key={product._id}
					productId={product._id}
					price={product.price}
					rating={product.rating}
					name={product.name}
					sold={product.total_sell}
					shopName={product.shop.name}
					imgUrl={product.images[0]?.url}
					discount_price={product.discount_price}
				/>
			))}
		</div>
	);
};

BestSellingPage.defaultProps = {
	type: "flex-wrap min-vh-100",
};

export default BestSellingPage;
