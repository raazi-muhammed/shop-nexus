import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import ProductCartMain from "../../components/product/ProductCartMain";

const ProductSuggestion = ({ productCategory }) => {
	const [productsData, setProductsData] = useState([]);
	useEffect(() => {
		axios
			.get(`${server}/products/filter-products/${productCategory}`)
			.then((res) => {
				setProductsData(res.data.products);
			})
			.catch((err) => console.log(err));
	}, [productCategory]);
	return (
		<div>
			<h2 className="text-secondary mt-4 mb-0 ms-3">Related Products</h2>
			<div
				className={`row mx-auto w-100 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 px-4`}>
				{productsData?.map((product) => (
					<ProductCartMain key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};

export default ProductSuggestion;
