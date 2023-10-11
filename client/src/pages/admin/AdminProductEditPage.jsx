import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import server from "../../server";
import toast from "react-hot-toast";
import categoryArry from "../../utils/category";

const AdminProductEditPage = () => {
	const { productId } = useParams();
	const [data, setData] = useState({ images: [] });
	const [category, setCategory] = useState("");
	const [rating, setRating] = useState(0);
	const [totalSales, setTotalSales] = useState(0);
	const [soldOut, setSoldOut] = useState(false);

	useEffect(() => {
		axios
			.get(`${server}/products/single-product/${productId}`)
			.then((res) => {
				setData(res.data?.productDetails[0]);
				const { category, rating, sold_out, total_sell } =
					res.data?.productDetails[0];
				setCategory(category);
				setRating(rating);
				setSoldOut(sold_out);
				setTotalSales(total_sell);
			})
			.catch((err) => console.log(err));
	}, []);
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = {
			category,
			rating,
			totalSales,
			soldOut,
		};
		axios
			.put(`${server}/products/edit-product-admin/${productId}`, formData, {
				withCredentials: true,
			})
			.then((res) => toast.success(res.data?.message))
			.catch((err) => toast.error(err.response.data.message));
	};
	return (
		<div className="w-100">
			<section className="row my-4">
				<img className="col-4 rounded-4" src={data.images[0]?.url} alt="" />
				<div className="col-6 my-auto">
					<p>Id: {data._id}</p>
					<p className="h4">{data.name}</p>
				</div>
			</section>
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className="mb-3">
					<label className="form-label" htmlFor="categorySelect">
						Select a Category:
					</label>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="form-select"
						id="categorySelect">
						<option value="">Select Category</option>
						{categoryArry.map((e) => (
							<option value={e}>{e}</option>
						))}
					</select>
				</div>
				<div className="mb-3">
					<label htmlFor="rating" className="form-label">
						Rating
					</label>
					<input
						type="number"
						className="form-control"
						id="rating"
						value={rating}
						name="rating"
						onChange={(e) => setRating(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="rating" className="form-label">
						Total Sales
					</label>
					<input
						type="number"
						className="form-control"
						id="rating"
						value={totalSales}
						name="rating"
						onChange={(e) => setTotalSales(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="rating" className="form-label">
						Sold Out
					</label>
					<input
						type="text"
						className="form-control"
						id="rating"
						value={soldOut}
						name="rating"
						onChange={(e) => setSoldOut(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Edit Product
				</button>
			</form>
		</div>
	);
};

export default AdminProductEditPage;
