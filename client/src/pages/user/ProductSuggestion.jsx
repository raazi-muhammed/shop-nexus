import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import ProductCartMain from "../../components/ProductCartMain";

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
				className={`row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 p-4`}>
				{productsData?.map((product) => (
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
		</div>
	);
};

export default ProductSuggestion;
