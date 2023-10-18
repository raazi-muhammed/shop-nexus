import React, { useEffect, useState } from "react";
import server from "../../../server";
import axios from "axios";
import ProductCartMain from "../../../components/ProductCartMain";
import ClipLoader from "react-spinners/ClipLoader";

const BestSellingPage = () => {
	const [loading, setLoading] = useState(false);
	const [productData, setProductData] = useState([]);

	useEffect(() => {
		setLoading(true);
		axios
			.get(`${server}/products/best-selling`)
			.then((res) => {
				setProductData(res.data.products);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<main className="vw-100 min-vh-100 mt-4">
			<div className="w-100 container container-xxl  ">
				{loading && (
					<div className="d-flex justify-content-center ">
						<ClipLoader
							className="text-primary mx-auto mt-5 "
							loading={loading}
							size={30}
							color="primary"
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					</div>
				)}
				<div
					className={`row w-100 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 px-4`}>
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
			</div>
		</main>
	);
};

export default BestSellingPage;
