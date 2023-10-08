import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import ProductCardRow from "../../components/ProductCardRow";

const SellerAllProducts = ({ shopId }) => {
	const [data, setData] = useState([{ image_Url: [] }]);
	useEffect(() => {
		axios
			.get(`${server}/seller/get-products-from-shop/${shopId}`)
			.then((res) => {
				console.log(res.data.data);
				setData(res.data.data);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="d-flex flex-column gap-2">
			<section className="row pb-0 mb-0 p-5 text-secondary fw-bold">
				<p className="col-6 m-0 ">Product Details</p>
				<p className="col-3 m-0">Info</p>
				<p className="col-2 m-0">Price</p>
			</section>
			{data.map((product) => (
				<ProductCardRow
					id={product._id}
					name={product.name}
					stock={product.stock}
					category={product.category}
					price={product.discount_price}
					imgUrl={product?.image_Url[0]?.url}
				/>
			))}
		</div>
	);
};

export default SellerAllProducts;
