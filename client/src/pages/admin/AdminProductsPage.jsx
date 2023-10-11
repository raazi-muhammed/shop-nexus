import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../server";
import ProductCardRow from "../../components/ProductCardRow";
import AdminProductCardRow from "../../components/AdminProductCardRow";

const AdminProductsPage = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		axios
			.get(`${server}/products/all-products-including-deleted`, { withCredentials: true })
			.then((res) => setData(res.data.products));
	}, []);
	return (
		<div className="d-flex flex-column gap-2">
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
