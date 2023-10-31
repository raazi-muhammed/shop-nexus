import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "../../components/Pagination";
import ProductCardRow from "../../components/product/ProductCardRow";
import Sorting from "../../components/Sorting";
import RefreshButton from "../../components/RefreshButton";

const SellerAllProducts = ({ shopId }) => {
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);
	const [pagination, setPagination] = useState({});
	const [sortOptions, setSortOptions] = useState({
		sortBy: "createdAt",
		sortItems: [
			{ value: "discount_price", title: "Price" },
			{ value: "createdAt", title: "Date" },
			{ value: "rating", title: "Rating" },
			{ value: "total_sell", title: "Total Sold" },
			{ value: "stock", title: "Stock" },
		],
	});

	const [data, setData] = useState([]);
	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/seller/get-products-from-shop/${shopId}?page=${
					pagination?.page || 1
				}&sort=${sortOptions.sortBy}`,
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
	}, [refresh, pagination?.page, sortOptions]);

	return (
		<div className="d-flex flex-column gap-2">
			{loading ? (
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
			) : (
				<>
					<section className="d-flex justify-content-end gap-3 ">
						<RefreshButton refresh={refresh} setRefresh={setRefresh} />
						<Sorting
							sortOptions={sortOptions}
							setSortOptions={setSortOptions}
						/>
						<Pagination pagination={pagination} setPagination={setPagination} />
					</section>
					<section className="row py-0 mb-0 p-5 text-secondary fw-bold">
						<p className="col-6 m-0 ">Product Details</p>
						<p className="col-3 m-0">Info</p>
						<p className="col-2 m-0">Price</p>
					</section>
					{data.map((product, i) => (
						<div key={i}>
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
						</div>
					))}
					{!loading && <p className="fw-bold m-3 text-danger">Deleted</p>}
					{data.map((product, i) => (
						<div key={i}>
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
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default SellerAllProducts;
