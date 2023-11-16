import React, { useEffect, useState } from "react";
import server from "../../../server";
import axios from "axios";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import ProductCartMain from "../../../components/product/ProductCartMain";

const ProductsPage = ({ showHeading }) => {
	const [loading, setLoading] = useState(false);
	const [productData, setProductData] = useState([]);
	const [pagination, setPagination] = useState({});

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/products/all-products?page=${
					pagination?.page || 1
				}&sort=rating`
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
			.catch((err) => {
				toast.error("Loading failed");
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
		<main className="vw-100 min-vh-100 p-24 mt-4">
			<div className="w-100 container container-xxl  ">
				{showHeading && <h2 className="text-secondary mx-4">Products</h2>}

				<div
					className={`row mx-auto w-100 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 px-4`}>
					{productData.map((product) => (
						<ProductCartMain key={product._id} product={product} />
					))}
				</div>
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
							<p className="mx-auto text-center text-secondary">Fully loaded</p>
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
		</main>
	);
};

ProductsPage.defaults = {
	showHeading: false,
};

export default ProductsPage;
