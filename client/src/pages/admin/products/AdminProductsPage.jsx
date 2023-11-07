import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import Pagination from "../../../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
import AdminProductCardRow from "../../../components/product/AdminProductCardRow";

const AdminProductsPage = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({});

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${server}/products/all-products-including-deleted?page=${
					pagination.page || 1
				}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setPagination(res.data.pagination);
				setData(res.data.products);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
	}, [pagination.page]);

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
				<p className="col-2 m-0">isDeleted</p>
			</section>
			{data.map((product, i) => (
				<AdminProductCardRow
					key={i}
					id={product._id}
					name={product.name}
					stock={product.stock}
					category={product.category}
					isDeleted={product.isDeleted}
					imgUrl={product?.images[0]?.url}
				/>
			))}
		</div>
	);
};

export default AdminProductsPage;
