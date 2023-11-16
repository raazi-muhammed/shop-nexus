import React, { useEffect, useState } from "react";
import server from "../../../server";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ProductCartMain from "../../../components/product/ProductCartMain";

const BestSellingPage = ({ showHeading }) => {
	const [loading, setLoading] = useState(false);
	const [productData, setProductData] = useState([]);
	const [pagination, setPagination] = useState({});

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/products/best-selling?page=${
					pagination?.page || 1
				}&sort=totalSell`
			)
			.then((res) => {
				/*  Aim: Making sure that we are not adding duplicates 
				Working:
				- Filtering products that are already in the display products */
				setProductData((currentProductData) => {
					const newProductsToAdd = res.data?.products?.filter((e) => {
						if (!currentProductData.some((product) => product?._id === e?._id))
							return e;
					});
					return [...currentProductData, ...newProductsToAdd];
				});
				setPagination(res.data.pagination);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [pagination.page]);

	const handleSeeMore = () => {
		setPagination({
			...pagination,
			page: `${++pagination.page}`,
		});
	};

	return (
		<main className="vw-100 min-vh-100 mt-4">
			<div className="w-100 container container-xxl  ">
				{showHeading && <h2 className="text-secondary mx-4">Best Selling</h2>}

				<div
					className={`row mx-auto w-100 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 px-4`}>
					{productData.map((product) => (
						<ProductCartMain key={product._id} product={product} />
					))}
				</div>

				<div className="d-flex align-items-center justify-content-center">
					{pagination?.page < pagination?.pageCount ? (
						<button
							disabled={loading}
							className="btn btn-sm text-center text-secondary fw-bold"
							onClick={handleSeeMore}>
							See more
						</button>
					) : (
						<>
							{!loading && (
								<p className="mx-auto text-center text-secondary">
									Fully loaded
								</p>
							)}
						</>
					)}
				</div>
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
			</div>
		</main>
	);
};

BestSellingPage.defaults = {
	showHeading: false,
};

export default BestSellingPage;
