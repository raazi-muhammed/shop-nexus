import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import ProductCardRow from "../../components/ProductCardRow";

const SellerAllProducts = ({ shopId }) => {
	const [data, setData] = useState([{ images: [] }]);
	useEffect(() => {
		axios
			.get(`${server}/seller/get-products-from-shop/${shopId}`)
			.then((res) => {
				setData(res.data.data);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="d-flex flex-column gap-2">
			<section className="row py-0 mb-0 p-5 text-secondary fw-bold">
				<p className="col-6 m-0 ">Product Details</p>
				<p className="col-3 m-0">Info</p>
				<p className="col-2 m-0">Price</p>
			</section>
			{!data[0].name ? (
				<p className="d-flex justify-content-center mt-5">Loading...</p>
			) : (
				data.map((product, i) => (
					<ProductCardRow
						key={i}
						id={product._id}
						name={product.name}
						stock={product.stock}
						category={product.category}
						price={product.discount_price}
						imgUrl={product?.images[0]?.url}
						shopId={shopId}
					/>
				))
			)}
		</div>
	);
};

export default SellerAllProducts;
