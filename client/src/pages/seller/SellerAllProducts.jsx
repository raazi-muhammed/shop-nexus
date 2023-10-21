import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import ProductCardRow from "../../components/ProductCardRow";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "../../components/Pagination";

const SellerAllProducts = ({ shopId }) => {
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({});

	const [data, setData] = useState([]);
	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/seller/get-products-from-shop/${shopId}?page=${
					pagination?.page || 1
				}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setData(res.data.data);
				setPagination(res.data.pagination);
			})
			.catch((err) => toast.error(err.response.data.message))
			.finally(() => {
				setLoading(false);
			});
	}, [pagination?.page]);

	return (
		<div className="d-flex flex-column gap-2">
			{loading && (
				<div className="min-vh-100 w-100 d-flex justify-content-center ">
					<ClipLoader
						className="m-0 p-0 text-primary mx-auto mt-5 "
						loading={loading}
						size={30}
						color="primary"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			)}
			<Pagination pagination={pagination} setPagination={setPagination} />
			<section className="row py-0 mb-0 p-5 text-secondary fw-bold">
				<p className="col-6 m-0 ">Product Details</p>
				<p className="col-3 m-0">Info</p>
				<p className="col-2 m-0">Price</p>
			</section>
			{data.map((product, i) => (
				<>
					{!product.isDeleted && (
						<ProductCardRow
							key={i}
							id={product._id}
							name={product.name}
							stock={product.stock}
							category={product.category}
							price={product.discount_price}
							imgUrl={product.images[0]?.url}
							shopId={shopId}
						/>
					)}
				</>
			))}
			{!loading && <p className="fw-bold m-3 text-danger">Deleted</p>}
			{data.map((product, i) => (
				<>
					{product.isDeleted && (
						<ProductCardRow
							key={i}
							id={product._id}
							name={product.name}
							stock={product.stock}
							category={product.category}
							price={product.discount_price}
							imgUrl={product.images[0]?.url}
							shopId={shopId}
						/>
					)}
				</>
			))}
		</div>
	);
};

export default SellerAllProducts;
